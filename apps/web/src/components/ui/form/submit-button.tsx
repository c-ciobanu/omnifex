import { useFormContext } from "@/hooks/form-context";

import { Button } from "../button";

type Props = Omit<React.ComponentProps<typeof Button>, "type" | "disabled">;

export function SubmitButton(props: Props) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <Button {...props} type="submit" disabled={isSubmitting} />}
    </form.Subscribe>
  );
}
