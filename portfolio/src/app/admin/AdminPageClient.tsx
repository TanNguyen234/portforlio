"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import type { PortfolioData } from "@/lib/portfolio";
import { usePortfolioData } from "@/lib/usePortfolioData";

const clone = (data: PortfolioData): PortfolioData =>
  JSON.parse(JSON.stringify(data)) as PortfolioData;

const updateByPath = (
  data: PortfolioData,
  path: Array<string | number>,
  value: string
): PortfolioData => {
  const next = clone(data) as Record<string, unknown>;
  let current: Record<string, unknown> = next;

  path.slice(0, -1).forEach((key) => {
    if (typeof key === "number") return;
    const nextValue = current[key];
    if (!nextValue || typeof nextValue !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  });

  const lastKey = path[path.length - 1];
  if (typeof lastKey === "number") {
    return next as PortfolioData;
  }
  current[lastKey] = value;
  return next as PortfolioData;
};

type AdminEditorProps = {
  data: PortfolioData;
  updatePortfolio: (next: PortfolioData) => Promise<{ success: boolean; error?: string }>;
  resetToDefault: () => Promise<{ success: boolean; error?: string }>;
  handleLogout: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
};

const AdminEditor = ({
  data,
  updatePortfolio,
  resetToDefault,
  handleLogout,
  showToast,
}: AdminEditorProps) => {
  const [draft, setDraft] = useState<PortfolioData>(() => clone(data));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const updateField = (path: Array<string | number>, value: string) => {
    setDraft((prev) => updateByPath(prev, path, value));
  };

  const updateArray = (
    path: Array<string | number>,
    index: number,
    value: string
  ) => {
    setDraft((prev) => {
      const next = clone(prev);
      let current: unknown = next;
      path.forEach((key) => {
        if (typeof key === "number") return;
        current = (current as Record<string, unknown>)[key];
      });
      if (Array.isArray(current)) {
        current[index] = value;
      }
      return next;
    });
  };

  const addProject = () => {
    setDraft((prev) => {
      const next = clone(prev);
      next.projects.push({
        title: "New Project",
        titleVi: "Dự án mới",
        period: "2026",
        description: "Short cinematic project description.",
        descriptionVi: "Mô tả ngắn gọn, giàu hình ảnh cho dự án.",
        highlights: ["Key highlight"],
        highlightsVi: ["Điểm nhấn chính"],
        stack: ["Tech"],
        link: "https://github.com/",
        demoLink: ""
      });
      return next;
    });
  };

  const addSkill = () => {
    setDraft((prev) => {
      const next = clone(prev);
      next.skills.constellation.push("New Skill");
      return next;
    });
  };

  const addTech = () => {
    setDraft((prev) => {
      const next = clone(prev);
      next.techStack.push("New Tech");
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updatePortfolio(draft);
    setIsSaving(false);
    if (res.success) {
      showToast("Lưu các thay đổi thành công!", "success");
    } else {
      showToast(res.error || "Lưu thay đổi thất bại!", "error");
    }
  };

  const handleRestore = async () => {
    if (!confirm("Bạn có chắc chắn muốn khôi phục dữ liệu mặc định?")) return;
    setIsSaving(true);
    const res = await resetToDefault();
    setIsSaving(false);
    if (res.success) {
      showToast("Khôi phục dữ liệu mặc định thành công!", "success");
    } else {
      showToast(res.error || "Khôi phục dữ liệu thất bại!", "error");
    }
  };

  const handleCvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      showToast("Vui lòng chọn 1 file PDF!", "error");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", cvFile);

      const res = await fetch("/api/portfolio/cv", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Tải lên CV mới thành công!", "success");
        setCvFile(null);
      } else {
        showToast(json.error || "Tải lên CV thất bại!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối khi tải lên CV!", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="section-shell min-h-screen pb-20">
      <div className="section-inner flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--accent-current)]">
              Admin Dashboard
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl">
              Chỉnh sửa portfolio
            </h1>
            <p className="text-sm text-white/60">
              Dữ liệu được lưu trữ trực tuyến trên MongoDB.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/5 transition-all"
            >
              Back to site
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-full border border-red-500/30 hover:border-red-500/50 bg-red-950/20 hover:bg-red-950/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-red-400 transition-all cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Column 1: Personal Info */}
          <div className="glass-card rounded-3xl p-6 space-y-4 lg:col-span-2">
            <h2 className="text-lg font-semibold text-[color:var(--accent-current)]">Thông tin cá nhân</h2>
            <div className="grid gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60 font-medium">Name</label>
                <input
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:border-[color:var(--accent-current)] transition-all"
                  value={draft.hero.name}
                  onChange={(event) =>
                    updateField(["hero", "name"], event.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60 font-medium">Role</label>
                <input
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:border-[color:var(--accent-current)] transition-all"
                  value={draft.hero.role}
                  onChange={(event) =>
                    updateField(["hero", "role"], event.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60 font-medium">Headline</label>
                <textarea
                  className="min-h-[90px] rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:border-[color:var(--accent-current)] transition-all"
                  value={draft.hero.headline}
                  onChange={(event) =>
                    updateField(["hero", "headline"], event.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60 font-medium">Headline (VI)</label>
                <textarea
                  className="min-h-[90px] rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:border-[color:var(--accent-current)] transition-all"
                  value={draft.hero.headlineVi ?? ""}
                  onChange={(event) =>
                    updateField(["hero", "headlineVi"], event.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60 font-medium">Subhead</label>
                <textarea
                  className="min-h-[90px] rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:border-[color:var(--accent-current)] transition-all"
                  value={draft.hero.subhead}
                  onChange={(event) =>
                    updateField(["hero", "subhead"], event.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60 font-medium">Subhead (VI)</label>
                <textarea
                  className="min-h-[90px] rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:border-[color:var(--accent-current)] transition-all"
                  value={draft.hero.subheadVi ?? ""}
                  onChange={(event) =>
                    updateField(["hero", "subheadVi"], event.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60 font-medium">Highlights (comma separated)</label>
                <input
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:border-[color:var(--accent-current)] transition-all"
                  value={draft.hero.highlights.join(", ")}
                  onChange={(event) =>
                    setDraft((prev) => {
                      const next = clone(prev);
                      next.hero.highlights = event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean);
                      return next;
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Column 2: Contact, CV Uploader & Config */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="glass-card rounded-3xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-[color:var(--accent-current)]">Liên hệ</h2>
              <div className="grid gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/60 font-medium">Location</label>
                  <input
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:border-[color:var(--accent-current)] transition-all"
                    value={draft.contact.location}
                    onChange={(event) =>
                      updateField(["contact", "location"], event.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/60 font-medium">Email</label>
                  <input
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:border-[color:var(--accent-current)] transition-all"
                    value={draft.contact.email}
                    onChange={(event) =>
                      updateField(["contact", "email"], event.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/60 font-medium">Phone</label>
                  <input
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:border-[color:var(--accent-current)] transition-all"
                    value={draft.contact.phone}
                    onChange={(event) =>
                      updateField(["contact", "phone"], event.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/60 font-medium">GitHub</label>
                  <input
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:border-[color:var(--accent-current)] transition-all"
                    value={draft.contact.github}
                    onChange={(event) =>
                      updateField(["contact", "github"], event.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* CV Uploader Card */}
            <div className="glass-card rounded-3xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-[color:var(--accent-current)]">Cập nhật CV (PDF)</h2>
              <form onSubmit={handleCvSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-white/10 hover:border-[color:var(--accent-current)]/50 rounded-2xl p-4 transition-all text-center relative bg-black/20">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCvFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="space-y-2">
                    <p className="text-xs text-white/70">
                      {cvFile ? `Đã chọn: ${cvFile.name}` : "Kéo thả hoặc click để chọn file PDF"}
                    </p>
                    <p className="text-[10px] text-white/40">Chỉ chấp nhận file PDF</p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isUploading || !cvFile}
                  className="w-full rounded-xl bg-white/10 border border-white/10 text-white font-medium hover:bg-white/15 px-4 py-3 text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isUploading ? "Đang tải lên..." : "Tải lên CV"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Projects Editor */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--accent-current)]">Dự án</h2>
            <button
              className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] hover:bg-white/5 cursor-pointer"
              type="button"
              onClick={addProject}
            >
              Thêm dự án
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {draft.projects.map((project, index) => (
              <div
                key={`${project.title}-${index}`}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[color:var(--accent-current)]">Dự án #{index + 1}</span>
                  <button
                    type="button"
                    className="text-xs text-red-400 hover:text-red-300"
                    onClick={() => {
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.projects.splice(index, 1);
                        return next;
                      });
                    }}
                  >
                    Xóa
                  </button>
                </div>
                <div className="grid gap-3">
                  <input
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                    placeholder="Title"
                    value={project.title}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.projects[index].title = event.target.value;
                        return next;
                      })
                    }
                  />
                  <input
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                    placeholder="Period"
                    value={project.period}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.projects[index].period = event.target.value;
                        return next;
                      })
                    }
                  />
                  <textarea
                    className="min-h-[70px] rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                    placeholder="Description"
                    value={project.description}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.projects[index].description = event.target.value;
                        return next;
                      })
                    }
                  />
                  <label className="text-[10px] text-white/50 uppercase tracking-wider">
                    Highlights (comma separated)
                  </label>
                  <input
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                    value={project.highlights.join(", ")}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.projects[index].highlights = event.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean);
                        return next;
                      })
                    }
                  />
                  <label className="text-[10px] text-white/50 uppercase tracking-wider">Stack (comma separated)</label>
                  <input
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                    value={project.stack.join(", ")}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.projects[index].stack = event.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean);
                        return next;
                      })
                    }
                  />
                  <input
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                    placeholder="GitHub Link"
                    value={project.link}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.projects[index].link = event.target.value;
                        return next;
                      })
                    }
                  />
                  <input
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                    placeholder="Demo Link (optional)"
                    value={project.demoLink || ""}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.projects[index].demoLink = event.target.value;
                        return next;
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills constellation and Tech Stack */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[color:var(--accent-current)]">Kỹ năng (constellation)</h2>
              <button
                className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] hover:bg-white/5 cursor-pointer"
                type="button"
                onClick={addSkill}
              >
                Thêm kỹ năng
              </button>
            </div>
            <div className="grid gap-2">
              {draft.skills.constellation.map((skill, index) => (
                <div key={`${skill}-${index}`} className="flex gap-2 items-center">
                  <input
                    className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                    value={skill}
                    onChange={(event) =>
                      updateArray(["skills", "constellation"], index, event.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="text-xs text-red-400 hover:text-red-300 px-2"
                    onClick={() => {
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.skills.constellation.splice(index, 1);
                        return next;
                      });
                    }}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[color:var(--accent-current)]">Tech stack</h2>
              <button
                className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] hover:bg-white/5 cursor-pointer"
                type="button"
                onClick={addTech}
              >
                Thêm tech
              </button>
            </div>
            <div className="grid gap-2">
              {draft.techStack.map((item, index) => (
                <div key={`${item}-${index}`} className="flex gap-2 items-center">
                  <input
                    className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                    value={item}
                    onChange={(event) =>
                      updateArray(["techStack"], index, event.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="text-xs text-red-400 hover:text-red-300 px-2"
                    onClick={() => {
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.techStack.splice(index, 1);
                        return next;
                      });
                    }}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
          <button
            className="rounded-full bg-emerald-500 hover:bg-emerald-600 border border-emerald-400/20 px-8 py-3 text-xs uppercase tracking-[0.3em] text-white transition-all shadow-lg hover:shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
            type="button"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button
            className="rounded-full border border-white/20 px-8 py-3 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            type="button"
            disabled={isSaving}
            onClick={handleRestore}
          >
            Khôi phục mặc định
          </button>
        </div>
      </div>
    </main>
  );
};

export default function AdminPageClient() {
  const { data, updatePortfolio, resetToDefault, loading: dataLoading } = usePortfolioData();
  const [auth, setAuth] = useState<{ authenticated: boolean; username?: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            setAuth({ authenticated: true, username: json.username });
          } else {
            setAuth({ authenticated: false });
          }
        } else {
          setAuth({ authenticated: false });
        }
      } catch (err) {
        setAuth({ authenticated: false });
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setAuth({ authenticated: true, username: usernameInput });
        showToast("Đăng nhập thành công!", "success");
      } else {
        setLoginError(json.error || "Sai tài khoản hoặc mật khẩu");
        showToast("Đăng nhập thất bại!", "error");
      }
    } catch (err) {
      setLoginError("Đã xảy ra lỗi kết nối");
      showToast("Đã xảy ra lỗi kết nối!", "error");
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setAuth({ authenticated: false });
        showToast("Đã đăng xuất!", "info");
      }
    } catch (err) {
      showToast("Đăng xuất thất bại!", "error");
    }
  };

  const dataKey = useMemo(() => JSON.stringify(data), [data]);

  // Loading state
  if (authLoading || (auth?.authenticated && dataLoading)) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center flex-col gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[color:var(--accent-current)] animate-spin" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Unauthenticated screen
  if (!auth?.authenticated) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Futuristic glowing backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[color:var(--accent-current)]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/10 shadow-2xl relative z-10 backdrop-blur-2xl bg-white/5 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--accent-current)]">Admin Panel</p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl">Đăng nhập</h1>
            <p className="text-xs text-white/50">Vui lòng cung cấp thông tin quản trị viên</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-white/60 font-medium">Tài khoản</label>
              <input
                type="text"
                required
                placeholder="Nhập tên đăng nhập"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-[color:var(--accent-current)] focus:outline-none transition-all placeholder-white/20 text-white"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-white/60 font-medium">Mật khẩu</label>
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-[color:var(--accent-current)] focus:outline-none transition-all placeholder-white/20 text-white"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 text-center font-medium bg-red-950/20 border border-red-500/10 py-2 rounded-lg">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full rounded-xl bg-white text-black font-semibold hover:bg-white/95 py-3 text-xs uppercase tracking-[0.2em] transition-all cursor-pointer disabled:opacity-50"
            >
              {loginSubmitting ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-all underline underline-offset-4">
              Quay lại trang chủ
            </Link>
          </div>
        </div>

        {/* Simple Toast display for login attempts */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            toast.type === "success" 
              ? "border-emerald-500/20 bg-emerald-950/80 text-emerald-400" 
              : toast.type === "error" 
                ? "border-rose-500/20 bg-rose-950/80 text-rose-400" 
                : "border-sky-500/20 bg-sky-950/80 text-sky-400"
          }`}>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  // Authenticated screen rendering AdminEditor
  return (
    <>
      <AdminEditor
        key={dataKey}
        data={data}
        updatePortfolio={updatePortfolio}
        resetToDefault={resetToDefault}
        handleLogout={handleLogout}
        showToast={showToast}
      />

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
          toast.type === "success" 
            ? "border-emerald-500/20 bg-emerald-950/80 text-emerald-400" 
            : toast.type === "error" 
              ? "border-rose-500/20 bg-rose-950/80 text-rose-400" 
              : "border-sky-500/20 bg-sky-950/80 text-sky-400"
        }`}>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </>
  );
}
