import "../index.css";

import { useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeProvider } from "@/components/theme-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  linkOptions,
  Outlet,
  useLocation,
  useMatchRoute,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FrownIcon, MenuIcon, SmileIcon, XIcon } from "lucide-react";

const authenticatedNavigation = linkOptions([
  { to: "/dashboard", label: "Dashboard" },
  { to: "/movies", label: "Movies" },
  { to: "/shows", label: "Shows" },
  { to: "/books", label: "Books" },
  { to: "/mangas", label: "Mangas" },
  { to: "/documents", label: "Documents" },
  { to: "/files", label: "Files" },
  { to: "/metrics", label: "Metrics" },
  { to: "/to-do-lists", label: "To Do Lists" },
  { to: "/shopping-lists", label: "Shopping Lists" },
  { to: "/invoices", label: "Invoices" },
  { to: "/tools/pomodoro", label: "Pomodoro Timer" },
]);

const desktopAuthenticatedNavigation = [
  linkOptions({ to: "/dashboard", label: "Dashboard" }),
  {
    section: "Media",
    links: linkOptions([
      { to: "/movies", label: "Movies" },
      { to: "/shows", label: "Shows" },
      { to: "/books", label: "Books" },
      { to: "/mangas", label: "Mangas" },
    ]),
  },
  linkOptions({ to: "/documents", label: "Documents" }),
  linkOptions({ to: "/files", label: "Files" }),
  linkOptions({ to: "/metrics", label: "Metrics" }),
  {
    section: "Lists",
    links: linkOptions([
      { to: "/to-do-lists", label: "To Do" },
      { to: "/shopping-lists", label: "Shopping" },
    ]),
  },
  linkOptions({ to: "/invoices", label: "Invoices" }),
  linkOptions({ to: "/tools/pomodoro", label: "Pomodoro Timer" }),
];

const guestNavigation = linkOptions([
  { to: "/search/movies", label: "Search Movies" },
  { to: "/search/shows", label: "Search Shows" },
  { to: "/search/books", label: "Search Books" },
  { to: "/search/mangas", label: "Search Mangas" },
  { to: "/invoices", label: "Invoices" },
  { to: "/tools/pomodoro", label: "Pomodoro Timer" },
]);

const authenticatedMenu = linkOptions([{ to: "/settings", label: "Settings" }]);
const guestMenu = linkOptions([
  { to: "/login", label: "Sign in" },
  { to: "/signup", label: "Sign up" },
]);

export interface RouterAppContext {
  auth: ReturnType<typeof authClient.useSession>["data"];
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: Component,
  head: () => ({
    meta: [{ title: "Omnifex" }],
  }),
});

function Component() {
  const router = useRouter();
  const location = useLocation();
  const matchRoute = useMatchRoute();

  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = authClient.useSession();

  const navigationLinks = session ? authenticatedNavigation : guestNavigation;
  const menuLinks = session ? authenticatedMenu : guestMenu;

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          await router.invalidate();
          await router.navigate({ to: "/" });
        },
      },
    });
  }

  const isInvoicePreviewPage = matchRoute({ to: "/invoices/$id/preview" }) !== false;
  if (isInvoicePreviewPage) {
    return <Outlet />;
  }

  return (
    <>
      <HeadContent />

      <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange storageKey="theme">
        <Collapsible asChild className="bg-slate-800" open={isOpen} onOpenChange={setIsOpen}>
          <nav>
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <Link to={session ? "/dashboard" : "/"} onClick={() => setIsOpen(false)}>
                  <Logo />
                </Link>

                <div className="ml-10 hidden items-baseline space-x-4 md:flex">
                  {session ? (
                    <NavigationMenu viewport={false}>
                      <NavigationMenuList>
                        {desktopAuthenticatedNavigation.map((e) =>
                          "section" in e ? (
                            <NavigationMenuItem key={e.section}>
                              <NavigationMenuTrigger
                                className={cn(
                                  buttonVariants({ variant: "ghost" }),
                                  "bg-transparent text-gray-300",
                                  e.links.some((item) => location.pathname.startsWith(item.to)) &&
                                    "bg-gray-900 text-white",
                                )}
                              >
                                {e.section}
                              </NavigationMenuTrigger>

                              <NavigationMenuContent className="z-50">
                                <div className="w-40">
                                  {e.links.map((item) => (
                                    <NavigationMenuLink key={item.to} asChild>
                                      <Link {...item} activeProps={{ className: "bg-gray-900 text-white" }}>
                                        {item.label}
                                      </Link>
                                    </NavigationMenuLink>
                                  ))}
                                </div>
                              </NavigationMenuContent>
                            </NavigationMenuItem>
                          ) : (
                            <NavigationMenuItem key={e.to}>
                              <Link
                                {...e}
                                className={cn(buttonVariants({ variant: "ghost" }), "text-gray-300")}
                                activeProps={{
                                  className: cn(buttonVariants({ variant: "ghost" }), "bg-gray-900 text-white"),
                                }}
                              >
                                {e.label}
                              </Link>
                            </NavigationMenuItem>
                          ),
                        )}
                      </NavigationMenuList>
                    </NavigationMenu>
                  ) : (
                    guestNavigation.map((navigationLink) => (
                      <Link
                        {...navigationLink}
                        key={navigationLink.to}
                        className={cn(buttonVariants({ variant: "ghost" }), "text-gray-300")}
                        activeProps={{ className: cn(buttonVariants({ variant: "ghost" }), "bg-gray-900 text-white") }}
                      >
                        {navigationLink.label}
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <Button asChild variant="ghost" size="icon" className="-mr-2 hidden text-gray-300 md:inline-flex">
                    <DropdownMenuTrigger>
                      {session ? <SmileIcon className="!h-6 !w-6" /> : <FrownIcon className="!h-6 !w-6" />}
                    </DropdownMenuTrigger>
                  </Button>

                  <DropdownMenuContent>
                    {menuLinks.map((menuLink) => (
                      <Link {...menuLink} key={menuLink.to}>
                        <DropdownMenuItem>{menuLink.label}</DropdownMenuItem>
                      </Link>
                    ))}

                    {session ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
                      </>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>

                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="-mr-2 text-gray-300 md:hidden">
                    {isOpen ? <XIcon className="!h-6 !w-6" /> : <MenuIcon className="!h-6 !w-6" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            <CollapsibleContent className="bg-slate-800 px-4 md:hidden">
              <div className="space-y-1 py-3">
                {navigationLinks.map((navigationLink) => (
                  <Link
                    {...navigationLink}
                    key={navigationLink.to}
                    className={cn(buttonVariants({ variant: "ghost" }), "flex justify-start text-gray-300")}
                    activeProps={{
                      className: cn(buttonVariants({ variant: "ghost" }), "flex justify-start bg-gray-900 text-white"),
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {navigationLink.label}
                  </Link>
                ))}
              </div>

              <Separator className="bg-slate-600" />

              <div className="space-y-2 py-3">
                {session ? (
                  <div className="flex items-center gap-2 px-4 text-white">
                    <SmileIcon />
                    <p className="text-base font-medium">{session.user.username}</p>
                  </div>
                ) : null}

                <div className="space-y-1">
                  {menuLinks.map((menuLink) => (
                    <Link
                      {...menuLink}
                      key={menuLink.to}
                      className={cn(buttonVariants({ variant: "ghost" }), "flex justify-start text-gray-400")}
                      activeProps={{
                        className: cn(
                          buttonVariants({ variant: "ghost" }),
                          "flex justify-start bg-gray-900 text-white",
                        ),
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {menuLink.label}
                    </Link>
                  ))}

                  {session ? (
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        void signOut();
                      }}
                      variant="ghost"
                      className="block text-left text-gray-400"
                    >
                      Sign out
                    </Button>
                  ) : null}
                </div>
              </div>
            </CollapsibleContent>
          </nav>
        </Collapsible>

        <main className="relative mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        <Separator className="mx-auto max-w-7xl" />

        <footer className="mx-auto max-w-7xl space-y-2 p-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="TMDB logo"
                className="w-28"
              />
            </a>
            <p>Movie data provided by TMDB</p>
          </div>

          <p>
            Icons by{" "}
            <a href="https://icons8.com" target="_blank" rel="noreferrer">
              Icons8
            </a>
          </p>

          <p>
            Sound effects from{" "}
            <a
              href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music"
              target="_blank"
              rel="noreferrer"
            >
              Pixabay
            </a>
          </p>

          <div className="flex items-center justify-between">
            <p>© {new Date().getFullYear()} Cristi Ciobanu</p>
            <a href="https://github.com/c-ciobanu/omnifex" target="_blank" rel="noreferrer">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </footer>

        <Toaster position="bottom-center" richColors closeButton />
      </ThemeProvider>

      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </>
  );
}
