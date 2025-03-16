import React from "react";
import { Helmet } from "react-helmet-async";
import Footer from "../footer/Footer";
import Header from "../header/Header";
// import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Sticky from "../sticky/Sticky";
import { AppLayoutContainer } from "./AppLayoutStyle";

type Props = {
    title?: string;
    navbar?: React.ReactNode;
    children: React.ReactNode;
};

const AppLayout: React.FC<Props> = ({
    children,
    navbar,
    title = "React Ecommerce Template",
}) => {
    return (
        <AppLayoutContainer>
            <Helmet>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>

            <Sticky fixedOn={0}>
                <Header />
            </Sticky>

            <main>
                {navbar && <div className="section-after-sticky">{navbar}</div>}
                <div className="section-after-sticky">{children}</div>
            </main>

            {/* <MobileNavigationBar /> */}
            <Footer />
        </AppLayoutContainer>
    );
};

export default AppLayout;
