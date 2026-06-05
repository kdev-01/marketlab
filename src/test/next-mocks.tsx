import type { ReactNode } from "react";
import { vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: { alt: string }) => (
    // biome-ignore lint/performance/noImgElement: test double for next/image
    <img alt={props.alt} />
  ),
}));
