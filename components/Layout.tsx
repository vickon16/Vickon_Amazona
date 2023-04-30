import { ThemeProvider } from "next-themes";
import Head from "next/head";
import {Header, Footer} from "@/components";

type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

const Layout = ({ title, description, children }: Props) => {
  return (
    <div className="w-full h-full relative min-h-[600px]">
      <Head>
        <title>
          {title ? `${title} - Vickon Sanity Amazona` : "Vickon Sanity Amazona"}
        </title>
        {description && <meta name="description" content={description}></meta>}
      </Head>

      <ThemeProvider enableSystem={true} attribute="class">
        <div className="showcase bg-primary dark:bg-secondary after:bg-white dark:after:bg-secondary"></div>
        <div className="sticky z-[10] top-0 left-0 right-0 w-full">
          <Header />
        </div>
        <main className="w-full max-w-1600 mx-auto px-3 sm:px-5 py-10 min-h-[600px]">{children}</main>
          <Footer />
      </ThemeProvider>
    </div>
  );
};

export default Layout;
