"use client";

import { useEffect, useState } from "react";
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

export default function AdminPage() {
  const { data, updatePortfolio, resetToDefault } = usePortfolioData();
  const [draft, setDraft] = useState<PortfolioData>(clone(data));

  useEffect(() => {
    setDraft(clone(data));
  }, [data]);

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
        period: "2026",
        description: "Short cinematic project description.",
        highlights: ["Key highlight"],
        stack: ["Tech"],
        link: "https://github.com/",
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

  return (
    <main className="section-shell">
      <div className="section-inner flex flex-col gap-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--accent-current)]">
              Admin Dashboard
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl">
              Chỉnh sửa portfolio
            </h1>
            <p className="text-sm text-white/60">
              Lưu dữ liệu vào LocalStorage. Không cần backend.
            </p>
          </div>
          <a
            href="/"
            className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70"
          >
            Back to site
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
            <div className="grid gap-3">
              <label className="text-xs text-white/60">Name</label>
              <input
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                value={draft.hero.name}
                onChange={(event) =>
                  updateField(["hero", "name"], event.target.value)
                }
              />
              <label className="text-xs text-white/60">Role</label>
              <input
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                value={draft.hero.role}
                onChange={(event) =>
                  updateField(["hero", "role"], event.target.value)
                }
              />
              <label className="text-xs text-white/60">Headline</label>
              <textarea
                className="min-h-[90px] rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                value={draft.hero.headline}
                onChange={(event) =>
                  updateField(["hero", "headline"], event.target.value)
                }
              />
              <label className="text-xs text-white/60">Headline (VI)</label>
              <textarea
                className="min-h-[90px] rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                value={draft.hero.headlineVi ?? ""}
                onChange={(event) =>
                  updateField(["hero", "headlineVi"], event.target.value)
                }
              />
              <label className="text-xs text-white/60">Subhead</label>
              <textarea
                className="min-h-[90px] rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                value={draft.hero.subhead}
                onChange={(event) =>
                  updateField(["hero", "subhead"], event.target.value)
                }
              />
              <label className="text-xs text-white/60">Subhead (VI)</label>
              <textarea
                className="min-h-[90px] rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                value={draft.hero.subheadVi ?? ""}
                onChange={(event) =>
                  updateField(["hero", "subheadVi"], event.target.value)
                }
              />
              <label className="text-xs text-white/60">Highlights (comma)</label>
              <input
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
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

          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Liên hệ</h2>
            <div className="grid gap-3">
              <label className="text-xs text-white/60">Location</label>
              <input
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                value={draft.contact.location}
                onChange={(event) =>
                  updateField(["contact", "location"], event.target.value)
                }
              />
              <label className="text-xs text-white/60">Email</label>
              <input
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                value={draft.contact.email}
                onChange={(event) =>
                  updateField(["contact", "email"], event.target.value)
                }
              />
              <label className="text-xs text-white/60">Phone</label>
              <input
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                value={draft.contact.phone}
                onChange={(event) =>
                  updateField(["contact", "phone"], event.target.value)
                }
              />
              <label className="text-xs text-white/60">GitHub</label>
              <input
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                value={draft.contact.github}
                onChange={(event) =>
                  updateField(["contact", "github"], event.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Dự án</h2>
            <button
              className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em]"
              type="button"
              onClick={addProject}
            >
              Thêm dự án
            </button>
          </div>
          <div className="grid gap-4">
            {draft.projects.map((project, index) => (
              <div
                key={`${project.title}-${index}`}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div className="grid gap-3">
                  <input
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
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
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
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
                    className="min-h-[70px] rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
                    value={project.description}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.projects[index].description = event.target.value;
                        return next;
                      })
                    }
                  />
                  <label className="text-xs text-white/50">
                    Highlights (comma)
                  </label>
                  <input
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
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
                  <label className="text-xs text-white/50">Stack (comma)</label>
                  <input
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
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
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
                    value={project.link}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const next = clone(prev);
                        next.projects[index].link = event.target.value;
                        return next;
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Kỹ năng (constellation)</h2>
              <button
                className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em]"
                type="button"
                onClick={addSkill}
              >
                Thêm kỹ năng
              </button>
            </div>
            <div className="grid gap-2">
              {draft.skills.constellation.map((skill, index) => (
                <input
                  key={`${skill}-${index}`}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
                  value={skill}
                  onChange={(event) =>
                    updateArray(["skills", "constellation"], index, event.target.value)
                  }
                />
              ))}
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Tech stack</h2>
              <button
                className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em]"
                type="button"
                onClick={addTech}
              >
                Thêm tech
              </button>
            </div>
            <div className="grid gap-2">
              {draft.techStack.map((item, index) => (
                <input
                  key={`${item}-${index}`}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
                  value={item}
                  onChange={(event) =>
                    updateArray(["techStack"], index, event.target.value)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs uppercase tracking-[0.3em]"
            type="button"
            onClick={() => updatePortfolio(draft)}
          >
            Lưu thay đổi
          </button>
          <button
            className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/70"
            type="button"
            onClick={resetToDefault}
          >
            Khôi phục mặc định
          </button>
        </div>
      </div>
    </main>
  );
}
