export const uiText = {
  en: {
    nav: {
      about: "About",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      tech: "Tech",
      wins: "Wins",
      contact: "Contact",
      admin: "Admin",
    },
    hero: {
      ctaPrimary: "Explore work",
      ctaSecondary: "Contact",
    },
    sections: {
      about: {
        eyebrow: "About",
        educationLabel: "Education",
      },
      experience: {
        eyebrow: "Experience",
        title: "Project-driven timeline",
        description:
          "Real builds, real constraints, and measurable outcomes. Each entry is engineered for production-minded delivery.",
      },
      projects: {
        eyebrow: "Projects",
        title: "Cinematic product builds",
        description:
          "Selected systems engineered end-to-end, from modeling strategy to deployment automation.",
      },
      skills: {
        eyebrow: "Skills",
        title: "Spectral skill field",
        description:
          "An animated lattice of tools and disciplines that orbit the way I deliver production AI.",
      },
      tech: {
        eyebrow: "Tech Stack",
        title: "Production-grade toolkit",
        description:
          "A focused stack optimized for AI workloads, data reliability, and fast iteration.",
      },
      achievements: {
        eyebrow: "Achievements",
        title: "Highlights that move the needle",
        description:
          "Concrete decisions that improved reliability, cost control, and deployment speed.",
      },
      contact: {
        eyebrow: "Contact",
        title: "Let us build something decisive",
        description:
          "Open to AI engineering roles, internships, and high-impact collaborations.",
      },
    },
    projects: {
      caseStudy: "Case study",
      expand: "Expand",
      view: "View",
      close: "Close",
      visitGithub: "Visit GitHub",
      visitDemo: "Open demo",
    },
    contact: {
      email: "Email me",
      github: "GitHub",
      linkedin: "LinkedIn",
      cv: "Download CV",
    },
    footer: "Crafted in Ho Chi Minh City - 2026",
    skillsFallback: "Lightweight mode is active on this device.",
  },
  vi: {
    nav: {
      about: "Giới thiệu",
      experience: "Kinh nghiệm",
      projects: "Dự án",
      skills: "Kỹ năng",
      tech: "Công nghệ",
      wins: "Thành tựu",
      contact: "Liên hệ",
      admin: "Quản trị",
    },
    hero: {
      ctaPrimary: "Xem dự án",
      ctaSecondary: "Liên hệ",
    },
    sections: {
      about: {
        eyebrow: "Giới thiệu",
        educationLabel: "Học vấn",
      },
      experience: {
        eyebrow: "Kinh nghiệm",
        title: "Lộ trình dự án",
        description:
          "Các dự án thật, ràng buộc thật, kết quả rõ ràng. Mỗi mục được thiết kế cho vận hành thực tế.",
      },
      projects: {
        eyebrow: "Dự án",
        title: "Sản phẩm kỹ thuật",
        description:
          "Lựa chọn hệ thống toàn diện, từ chiến lược mô hình đến tự động hóa triển khai.",
      },
      skills: {
        eyebrow: "Kỹ năng",
        title: "Phổ kỹ năng sống",
        description:
          "Mạng lưới chuyển động của công cụ và năng lực trong hành trình triển khai AI.",
      },
      tech: {
        eyebrow: "Công nghệ",
        title: "Bộ công cụ sản xuất",
        description:
          "Tập trung vào AI, độ tin cậy dữ liệu và tốc độ lặp trình nhanh.",
      },
      achievements: {
        eyebrow: "Thành tựu",
        title: "Những dấu ấn quan trọng",
        description:
          "Các quyết định giúp ổn định hệ thống, kiểm soát chi phí và tăng tốc triển khai.",
      },
      contact: {
        eyebrow: "Liên hệ",
        title: "Cùng tạo ra sản phẩm đẳng cấp",
        description: "Sẵn sàng cho vai trò AI, thực tập và dự án có tác động.",
      },
    },
    projects: {
      caseStudy: "Nghiên cứu tình huống",
      expand: "Mở rộng",
      view: "Xem",
      close: "Đóng",
      visitGithub: "Mở GitHub",
      visitDemo: "Mở demo",
    },
    contact: {
      email: "Gửi email",
      github: "GitHub",
      linkedin: "LinkedIn",
      cv: "Tải CV",
    },
    footer: "Thiết kế tại TP. Hồ Chí Minh - 2026",
    skillsFallback:
      "Chế độ tinh giản đang hoạt động trên thiết bị cấu hình thấp.",
  },
} as const;

export type Locale = keyof typeof uiText;
export type UiText = (typeof uiText)[Locale];
