"use client";

import React from "react";
import { GithubLogo, LinkedinLogo, type IconProps } from "@phosphor-icons/react";

export function Github({ className = "h-4 w-4", weight = "light", ...props }: IconProps) {
  return <GithubLogo className={className} weight={weight} {...props} />;
}

export function Linkedin({ className = "h-4 w-4", weight = "light", ...props }: IconProps) {
  return <LinkedinLogo className={className} weight={weight} {...props} />;
}
