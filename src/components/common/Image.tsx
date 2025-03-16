import React from "react";

// Try importing `next/image`, but fallback to default `img` if Next.js is unavailable
let NextImage: any;
try {
    NextImage = require("next/image").default;
} catch (error) {
    NextImage = null; // Next.js is not available
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    sizes?: string; // ✅ Allow responsive sizes
    nextOptimized?: boolean; // ✅ Allow forcing Next.js optimization
    className?: string; // ✅ Support custom styling
}

const Image: React.FC<ImageProps> = ({ src, alt, width, height, sizes, nextOptimized = true, className, ...props }) => {
    if (NextImage && nextOptimized) {
        // ✅ Use Next.js <Image> for better optimization & responsive handling
        return (
            <NextImage
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes={sizes || "100vw"} // ✅ Ensure images adjust dynamically
                style={{ objectFit: "cover" }} // ✅ Prevent image distortion
                className={className} // ✅ Allow custom styling
                {...props}
            />
        );
    } else {
        // ✅ Fallback <img> for non-Next.js environments
        return (
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                loading="lazy"
                style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "cover",
                }} // ✅ Responsive fallback
                {...props}
            />
        );
    }
};

export default Image;
