"use client"; // ✅ Required for client-side data fetching

import Link from "next/link";
import { useEffect, useState } from "react";
import { NavLink } from "./NavLink";
import { executeGraphQL } from "../../../lib/graphql";
import { MenuGetBySlugDocument } from "../../../gql/graphql";

type NavLinksProps = {
	channel: string;
};

export const NavLinks = ({ channel }: NavLinksProps) => {
	const [navLinks, setNavLinks] = useState<any[]>([]); // ✅ Store fetched links

	useEffect(() => {
		const fetchNavLinks = async () => {
			try {
				const data = await executeGraphQL(MenuGetBySlugDocument, {
					variables: { slug: "navbar", channel },
					revalidate: 60 * 60 * 24,
				});
				setNavLinks(data.menu?.items || []);
			} catch (error) {
				console.error("Failed to fetch navigation links:", error);
			}
		};

		fetchNavLinks();
	}, [channel]); // ✅ Fetch when `channel` changes

	return (
		<>
			<NavLink href="/products">All</NavLink>
			{navLinks.map((item) => {
				if (item.category) {
					return (
						<NavLink key={item.id} href={`/categories/${item.category.slug}`}>
							{item.category.name}
						</NavLink>
					);
				}
				if (item.collection) {
					return (
						<NavLink key={item.id} href={`/collections/${item.collection.slug}`}>
							{item.collection.name}
						</NavLink>
					);
				}
				if (item.page) {
					return (
						<NavLink key={item.id} href={`/pages/${item.page.slug}`}>
							{item.page.title}
						</NavLink>
					);
				}
				if (item.url) {
					return (
						<Link key={item.id} href={item.url}>
							{item.name}
						</Link>
					);
				}
				return null;
			})}
		</>
	);
};
