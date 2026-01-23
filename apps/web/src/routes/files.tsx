import type { OrpcClientOutputs } from "@/utils/orpc";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useAppForm } from "@/hooks/form";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { filesize } from "filesize";
import {
  DownloadIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  MoreVerticalIcon,
  TrashIcon,
  UploadCloudIcon,
} from "lucide-react";
import * as z from "zod";

export const Route = createFileRoute("/files")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

type UploadedFile = OrpcClientOutputs["files"]["getAll"][number];

function UploadedFileIcon({ contentType }: { contentType: string }) {
  if (contentType.startsWith("image")) {
    return <ImageIcon className="text-purple-500" />;
  }

  if (contentType === "application/pdf") {
    return <FileTextIcon className="text-red-500" />;
  }

  if (contentType === "text/plain") {
    return <FileTextIcon className="text-blue-500" />;
  }

  return <FileIcon />;
}

const formSchema = z.object({
  file: z.instanceof(File),
});

function Component() {
  const [fileToDelete, setFileToDelete] = useState<UploadedFile>();

  const { data: files, isLoading } = useQuery(orpc.files.getAll.queryOptions());

  const createPresignedUploadUrlMutation = useMutation(orpc.files.createPresignedUploadUrl.mutationOptions());
  const createFileMutation = useMutation(
    orpc.files.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.files.getAll.queryOptions());

        form.reset();
      },
    }),
  );

  const deleteFileMutation = useMutation(
    orpc.files.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.files.getAll.queryOptions());

        setFileToDelete(undefined);
      },
    }),
  );

  const createPresignedDownloadUrlMutation = useMutation(orpc.files.createPresignedDownloadUrl.mutationOptions());

  const downloadFile = async (file: UploadedFile) => {
    const downloadUrl = await createPresignedDownloadUrlMutation.mutateAsync({ id: file.id });

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const form = useAppForm({
    defaultValues: {
      file: undefined as unknown as File,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { file } = formSchema.parse(value);

      const uploadUrl = await createPresignedUploadUrlMutation.mutateAsync({
        fileName: file.name,
        contentType: file.type,
        contentSize: file.size,
      });

      await fetch(uploadUrl, { method: "PUT", body: file });

      await createFileMutation.mutateAsync({
        fileName: file.name,
        contentType: file.type,
        contentSize: file.size,
      });
    },
  });

  if (isLoading || !files) {
    return <Spinner />;
  }

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          await form.handleSubmit();
        }}
        className="mb-4 flex gap-2"
      >
        <FieldGroup>
          <form.AppField name="file" children={(field) => <field.FileInputField />} />
        </FieldGroup>

        <form.AppForm>
          <form.SubmitButton>
            <UploadCloudIcon />
            Upload
          </form.SubmitButton>
        </form.AppForm>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
          <Card key={file.id}>
            <CardContent>
              <div className="flex items-start justify-between">
                <UploadedFileIcon contentType={file.contentType} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => downloadFile(file)}>
                      <DownloadIcon />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFileToDelete(file)}>
                      <TrashIcon />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="truncate text-sm font-medium">{file.name}</h3>

              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>{filesize(file.contentSize)}</span>
                <span>{file.createdAt.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {fileToDelete ? (
        <AlertDialog open={true} onOpenChange={() => setFileToDelete(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete file?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the file &#34;{fileToDelete.name}&#34;?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => deleteFileMutation.mutate({ id: fileToDelete.id })}
                disabled={deleteFileMutation.isPending}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </>
  );
}
