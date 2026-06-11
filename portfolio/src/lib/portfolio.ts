export const portfolio = {
  hero: {
    name: "Nguyen Thanh Duy Tan",
    role: "AI Engineer",
    roleVi: "Kỹ sư AI",
    headline:
      "\"Building production-grade AI systems engineered for longevity, clarity, and adaptability.\"",
    headlineVi:
      "\"Xây dựng hệ thống AI chuẩn sản xuất, tập trung vào độ bền vững, rõ ràng và khả năng thích ứng.\"",
    subhead:
      "Focused on NLP, computer vision, and MLOps with a bias toward real-world deployment, latency, and measurable impact.",
    subheadVi:
      "Tập trung vào NLP, computer vision và MLOps, ưu tiên triển khai thực tế, độ trễ và tác động đo được.",
    location: "Tan Binh, Ho Chi Minh City",
    locationVi: "Tân Bình, TP. Hồ Chí Minh",
    highlights: [
      "Multi-agent LLM evaluation",
      "Fraud detection at 0.17% positive rate",
      "FastAPI + SSE delivery",
      "MLOps-ready CI/CD",
    ],
    highlightsVi: [
      "Đánh giá LLM đa tác tử",
      "Phát hiện gian lận ở tỷ lệ dương 0.17%",
      "FastAPI + SSE cho streaming",
      "CI/CD sẵn sàng cho MLOps",
    ],
  },
  about: {
    title: "AI engineer in the making, obsessed with system reliability.",
    titleVi: "Kỹ sư AI đang hoàn thiện, ám ảnh bởi độ tin cậy hệ thống.",
    body: [
      "I design and ship applied AI products with a focus on robustness and operational clarity. My work blends LLM orchestration, traditional ML, and clean backend delivery so models can survive production reality.",
      "From multi-agent evaluation graphs to fraud detection services, I prioritize traceability, monitoring, and measurable performance across the entire lifecycle.",
    ],
    bodyVi: [
      "Tôi thiết kế và triển khai sản phẩm AI ứng dụng với ưu tiên độ bền vững và minh bạch vận hành. Công việc của tôi kết hợp điều phối LLM, ML truyền thống và backend sạch để mô hình chạy được trong thực tế.",
      "Từ hệ thống đánh giá đa tác tử đến dịch vụ phát hiện gian lận, tôi ưu tiên truy vết, theo dõi và hiệu suất đo được trong suốt vòng đời.",
    ],
    education: {
      school: "Ho Chi Minh City University of Natural Resources and Environment",
      schoolVi: "Đại học Tài nguyên và Môi trường TP. Hồ Chí Minh",
      period: "Oct 2023 - Present",
      periodVi: "10/2023 - Hiện tại",
      major: "Information Technology",
      majorVi: "Công nghệ thông tin",
      desc: "Actively studying core software engineering, data structures, algorithms, and researching applied AI integration.",
      descVi: "Đang học tập các môn cốt lõi về kỹ thuật phần mềm, cấu trúc dữ liệu, giải thuật và nghiên cứu ứng dụng trí tuệ nhân tạo.",

    },
  },
  experience: [
    {
      period: "03/2026 - Present",
      role: "AI Engineer (Project) - CV AI Evaluation System",
      roleVi: "Kỹ sư AI (Dự án) - Hệ thống đánh giá CV AI",
      summary:
        "Built a multi-agent resume evaluation platform that orchestrates foundational, professional, and project-level analysis in parallel while preserving decision consistency.",
      summaryVi:
        "Xây dựng nền tảng đánh giá CV đa tác tử, điều phối song song các lớp đánh giá trong khi vẫn giữ tính nhất quán quyết định.",
      bullets: [
        "LangGraph workflow with concurrent evaluation phases",
        "RAG enrichment via Tavily for market context",
        "Async FastAPI backend with SSE streaming",
        "MongoDB Base64 storage and spam validation",
      ],
      bulletsVi: [
        "Luồng LangGraph chạy song song các pha đánh giá",
        "RAG với Tavily để bổ sung ngữ cảnh thị trường",
        "FastAPI async với SSE streaming",
        "MongoDB Base64 và lọc spam",
      ],
    },
    {
      period: "05/2026 - Present",
      role: "ML Engineer (Project) - Fraud Detection Pipeline",
      roleVi: "Kỹ sư ML (Dự án) - Pipeline phát hiện gian lận",
      summary:
        "Delivered a production-ready fraud detection service optimized for extreme class imbalance and fast inference pipelines.",
      summaryVi:
        "Triển khai dịch vụ phát hiện gian lận sẵn sàng production, tối ưu cho dữ liệu mất cân bằng và suy diễn nhanh.",
      bullets: [
        "XGBoost model trained on 0.17% fraud distribution",
        "FastAPI inference for single and batch transactions",
        "Dockerized CI/CD with GitHub Actions",
        "Pytest + Pydantic validation suite",
      ],
      bulletsVi: [
        "Mô hình XGBoost huấn luyện trên phân bố gian lận 0.17%",
        "FastAPI suy diễn cho giao dịch lẻ và theo lô",
        "Docker hóa CI/CD với GitHub Actions",
        "Pytest + Pydantic kiểm định schema",
      ],
    },
  ],
  projects: [
    {
      title: "CV AI Evaluation System",
      titleVi: "Hệ thống đánh giá CV AI",
      period: "03/2026 - Present",
      description:
        "Full-stack, multi-agent AI system for automated resume parsing, profiling, and professional evaluation with streaming results.",
      descriptionVi:
        "Hệ thống AI đa tác tử full-stack cho phân tích CV, tạo hồ sơ và đánh giá chuyên môn với kết quả streaming.",
      highlights: [
        "Concurrent LangGraph evaluation stages",
        "Meta-evaluator for cross-agent consistency",
        "Rate limiter and AI spam validation",
        "MongoDB persistence optimized for low latency",
      ],
      highlightsVi: [
        "Đánh giá LangGraph chạy đồng thời",
        "Meta-evaluator đảm bảo nhất quán",
        "Rate limiter và AI spam validation",
        "MongoDB tối ưu độ trễ",
      ],
      stack: [
        "Python",
        "FastAPI",
        "LangGraph",
        "LangChain",
        "LLMs (Gemini, Qwen)",
        "MongoDB",
        "SSE",
      ],
      link: "https://github.com/TanNguyen234/CV-Review-System",
      demoLink: "https://foxy0505-ai-cv-reviewer.hf.space/app",
    },
    {
      title: "End-to-End Fraud Detection Pipeline",
      titleVi: "Pipeline phát hiện gian lận end-to-end",
      period: "05/2026 - Present",
      description:
        "Production-grade ML service for credit card fraud detection with strict schema validation and CI/CD automation.",
      descriptionVi:
        "Dịch vụ ML sẵn sàng production cho phát hiện gian lận thẻ với kiểm định schema và tự động hóa CI/CD.",
      highlights: [
        "XGBoost model tuned for severe imbalance",
        "Single + batch inference up to 100 transactions",
        "Docker deployment pipeline",
        "Ruff linting + Pytest coverage",
      ],
      highlightsVi: [
        "XGBoost tối ưu cho dữ liệu mất cân bằng",
        "Suy diễn lẻ + lô đến 100 giao dịch",
        "Pipeline triển khai Docker",
        "Ruff linting + Pytest coverage",
      ],
      stack: [
        "Python",
        "XGBoost",
        "Scikit-learn",
        "FastAPI",
        "Docker",
        "GitHub Actions",
        "Pytest",
      ],
      link: "https://github.com/TanNguyen234/End-to-End-Fraud-Detection-Pipeline",
      demoLink: "",
    },
  ],
  skills: {
    constellation: [
      "LLMs",
      "LangGraph",
      "LangChain",
      "RAG",
      "FastAPI",
      "Docker",
      "CI/CD",
      "Pytest",
      "XGBoost",
      "Scikit-learn",
      "MongoDB",
      "SSE",
      "Pandas",
      "NumPy",
      "EDA",
      "System Design",
    ],
    categories: [
      {
        title: "Machine Learning",
        titleVi: "Học máy",
        items: [
          "Scikit-learn",
          "XGBoost",
          "Imbalanced data handling",
          "EDA & feature engineering",
        ],
        itemsVi: [
          "Scikit-learn",
          "XGBoost",
          "Xử lý dữ liệu mất cân bằng",
          "EDA & feature engineering",
        ],
      },
      {
        title: "Generative AI & NLP",
        titleVi: "AI sinh & NLP",
        items: [
          "LLM orchestration",
          "LangGraph / LangChain",
          "RAG pipelines",
          "Multi-agent systems",
        ],
        itemsVi: [
          "Điều phối LLM",
          "LangGraph / LangChain",
          "Pipeline RAG",
          "Hệ đa tác tử",
        ],
      },
      {
        title: "MLOps & Backend",
        titleVi: "MLOps & Backend",
        items: [
          "FastAPI",
          "Docker",
          "CI/CD automation",
          "RESTful APIs",
        ],
        itemsVi: [
          "FastAPI",
          "Docker",
          "Tự động hóa CI/CD",
          "RESTful APIs",
        ],
      },
      {
        title: "Data & Tooling",
        titleVi: "Dữ liệu & Công cụ",
        items: ["MongoDB (Motor Async)", "Git & GitHub", "Linux", "Jupyter"],
        itemsVi: [
          "MongoDB (Motor Async)",
          "Git & GitHub",
          "Linux",
          "Jupyter",
        ],
      },
    ],
  },
  techStack: [
    "Python",
    "FastAPI",
    "LangGraph",
    "LangChain",
    "LLMs",
    "XGBoost",
    "MongoDB",
    "Docker",
    "GitHub Actions",
    "Pytest",
  ],
  achievements: [
    "Designed concurrent evaluation phases to cut LLM evaluation latency.",
    "Enforced cross-agent consistency with a dedicated meta-evaluator.",
    "Reduced cost exposure with a 5-requests/day limiter and spam filter.",
    "Delivered strict schema validation for inference requests with Pydantic.",
    "Shipped CI/CD pipelines that lint, test, and deploy Docker images.",
  ],
  achievementsVi: [
    "Thiết kế đánh giá đồng thời để giảm độ trễ LLM.",
    "Đảm bảo nhất quán giữa các tác tử bằng meta-evaluator.",
    "Giảm chi phí với limiter 5 request/ngày và spam filter.",
    "Kiểm định schema request bằng Pydantic.",
    "Triển khai CI/CD lint, test và deploy Docker image.",
  ],
  contact: {
    email: "tanntd.2005@gmail.com",
    emailVi: "tanntd.2005@gmail.com",
    phone: "0339900276",
    phoneVi: "0339900276",
    github: "https://github.com/TanNguyen234",
    githubVi: "https://github.com/TanNguyen234",
    linkedin: "https://www.linkedin.com/in/tannguyen234",
    linkedinVi: "https://www.linkedin.com/in/tannguyen234",
    cv: "/api/cv",
    cvVi: "/api/cv",
    location: "Tan Binh District, Ho Chi Minh City",
    locationVi: "Tân Bình, TP. Hồ Chí Minh",
  },
};

export type PortfolioData = typeof portfolio;
