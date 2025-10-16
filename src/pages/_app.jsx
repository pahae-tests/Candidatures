import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from "@/components/Header";
import styles from "@/styles/globals.css";
import { verifyAuth } from "../middlewares/auth";

export default function MyApp({ Component, pageProps }) {
    const session = pageProps.session;
    const [isDark, setIsDark] = useState(true);
    const [applications, setApplications] = useState([]);
    const router = useRouter();

    useEffect(() => {
        let theme = localStorage.getItem("theme") || 'dark';
        setIsDark(theme === "dark");

        const fetchApplications = async () => {
            if(!session) return;
            try {
                const response = await fetch(`/api/get?user=${session._id}`);
                if (response.ok) {
                    const data = await response.json();
                    setApplications(data);
                } else {
                    console.error("Erreur lors de la récupération des candidatures");
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
            }
        };
        fetchApplications();
    }, [session]);

    return (
        <div className='w-full h-screen'>
            {!["/Register", "/Login"].includes(router.pathname) && (
                <Header isDark={isDark} setIsDark={setIsDark} />
            )}
            <Component
                {...pageProps}
                isDark={isDark}
                applications={applications}
                setApplications={setApplications}
            />
        </div>
    );
}

export async function getServerSideProps({ req, res }) {
    const user = verifyAuth(req, res);

    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: { session: { _id: user._id, nom: user.nom, prenom: user.prenom } },
    };
}