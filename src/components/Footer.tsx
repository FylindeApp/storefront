import React from "react";
import Link from "next/link";
import Image from "./Image";
import { StyledFooter } from "./footer/StyledFooter";
import { LinkWithChannel } from "./atoms/LinkWithChannel";
import { ChannelSelect } from "./ChannelSelect";
import { ChannelsListDocument, MenuGetBySlugDocument } from "../gql/graphql";
import { executeGraphQL } from "../lib/graphql";
import type { Request, Response } from "express"; // ✅ Import Express Types

export async function Footer({ channel, req, res }: { channel: string; req: Request; res: Response }) {
	const footerLinksResponse = await executeGraphQL(req, res, MenuGetBySlugDocument, {
		variables: { slug: "footer", channel },
		revalidate: 60 * 60 * 24,
	});

	const footerLinks = footerLinksResponse?.menu || null; // ✅ Ensure destructuring is correct

	const channelsResponse = process.env.FYLINDE_APP_TOKEN
		? await executeGraphQL(req, res, ChannelsListDocument, {
			variables: {}, // ✅ Fix: Add empty variables object
			withAuth: false,
			headers: {
				Authorization: `Bearer ${process.env.FYLINDE_APP_TOKEN}`,
			},
		})
		: null;

	const channels = channelsResponse?.channels || null; // ✅ Ensure destructuring is correct

	const currentYear = new Date().getFullYear();

	return (
		<StyledFooter>
			{/* Top Section - Dynamic Footer Links */}
			<div className="footer-top">
				{footerLinks?.items?.map((item) => (
					<div key={item.id} className="column">
						<h4>{item.name}</h4>
						<ul>
							{item.children?.map((child) => {
								if (child.category) {
									return (
										<li key={child.id}>
											<LinkWithChannel to={`/categories/${child.category.slug}`}>
												{child.category.name}
											</LinkWithChannel>
										</li>
									);
								}
								if (child.collection) {
									return (
										<li key={child.id}>
											<LinkWithChannel to={`/collections/${child.collection.slug}`}>
												{child.collection.name}
											</LinkWithChannel>
										</li>
									);
								}
								if (child.page) {
									return (
										<li key={child.id}>
											<LinkWithChannel to={`/pages/${child.page.slug}`}>
												{child.page.title}
											</LinkWithChannel>
										</li>
									);
								}
								if (child.url) {
									return (
										<li key={child.id}>
											<LinkWithChannel to={child.url}>{child.name}</LinkWithChannel>
										</li>
									);
								}
								return null;
							})}
						</ul>
					</div>
				))}

				{/* Static Sections */}
				<div className="column">
					<h4>Company</h4>
					<ul>
						<li><Link href="/about">About Us</Link></li>
						<li><Link href="/careers">Careers</Link></li>
						<li><Link href="/press">Press</Link></li>
						<li><Link href="/blog">Blog</Link></li>
					</ul>
				</div>

				<div className="column">
					<h4>Support</h4>
					<ul>
						<li><Link href="/help">Help Center</Link></li>
						<li><Link href="/returns">Returns</Link></li>
						<li><Link href="/shipping">Shipping</Link></li>
						<li><Link href="/contact">Contact Us</Link></li>
					</ul>
				</div>

				<div className="column">
					<h4>Stay Connected</h4>
					<div className="social-icons">
						<Link href="https://facebook.com" target="_blank"><i className="fab fa-facebook"></i></Link>
						<Link href="https://twitter.com" target="_blank"><i className="fab fa-twitter"></i></Link>
						<Link href="https://instagram.com" target="_blank"><i className="fab fa-instagram"></i></Link>
						<Link href="https://linkedin.com" target="_blank"><i className="fab fa-linkedin"></i></Link>
					</div>
				</div>
			</div>

			{/* Middle Section */}
			<div className="footer-middle">
				{channels && (
					<div className="channel-select">
						<label>
							<span>Change currency:</span>
							<ChannelSelect channels={channels} />
						</label>
					</div>
				)}

				<div className="newsletter">
					<h4>Subscribe to our Newsletter</h4>
					<form>
						<input type="email" placeholder="Enter your email" />
						<button type="submit">Subscribe</button>
					</form>
				</div>
			</div>

			{/* Bottom Section */}
			<div className="footer-bottom">
				<p>© {currentYear} Your Store, Inc.</p>
				<ul>
					<li><Link href="/privacy-policy">Privacy Policy</Link></li>
					<li><Link href="/terms-of-service">Terms of Service</Link></li>
					<li><Link href="/cookies">Cookies</Link></li>
				</ul>
				<p className="powered-by">
					Powered by <Link href="https://fylinde.io/" target="_blank">Fylinde</Link>{" "}
					<Link href="https://github.com/fylinde/fylinde" target="_blank">
						<Image alt="Fylinde GitHub repository" height={20} width={20} src="/github-mark.svg" />
					</Link>
				</p>
			</div>
		</StyledFooter>
	);
}
