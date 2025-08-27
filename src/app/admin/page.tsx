"use client";

import { useState } from "react";

const PASSWORD = "115563701Nueve!";

type CreateType = "article" | "resource" | "course";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [creating, setCreating] = useState<CreateType>("article");
  const [status, setStatus] = useState<string>("");

  // Common fields
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState(""); // comma-separated
  const [date, setDate] = useState("");
  const [md, setMd] = useState("");

  // Resource specific
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");

  // Course specific
  const [nivel, setNivel] = useState("");
  const [courseTime, setCourseTime] = useState("");

  const handleLogin = () => {
    if (inputPassword === PASSWORD) {
      setAuthed(true);
      setStatus("");
    } else {
      setStatus("Contraseña incorrecta");
    }
  };

  const resetForm = () => {
    setSlug("");
    setTitle("");
    setExcerpt("");
    setAuthor("");
    setTags("");
    setDate("");
  setType("");
    setLink("");
    setImage("");
    setNivel("");
    setCourseTime("");
  setMd("");
  };

  const createContent = async () => {
    try {
      setStatus("Enviando...");
      const payload: any = {
        slug,
        title,
        excerpt,
        author,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        date,
      };

      let url = "";
      if (creating === "article") {
        url = "/api/articles/upload-markdown";
        payload.published = true;
        payload.md = md;
      } else if (creating === "resource") {
        url = "/api/resources/upload-markdown";
        payload.fileName = slug; // ese endpoint espera fileName
        payload.content = `---\n${title ? `title: '${title.replace(/'/g, "''")}'\n` : ''}${type ? `type: '${type.replace(/'/g, "''")}'\n` : ''}${excerpt ? `excerpt: '${excerpt.replace(/'/g, "''")}'\n` : ''}${date ? `date: '${date.replace(/'/g, "''")}'\n` : ''}${author ? `author: '${author.replace(/'/g, "''")}'\n` : ''}${tags ? `tags: [${tags.split(',').map(t=>`'${t.trim().replace(/'/g, "''")}'`).join(', ')}]\n` : ''}${image ? `image: '${image.replace(/'/g, "''")}'\n` : ''}${link ? `link: '${link.replace(/'/g, "''")}'\n` : ''}---\n\n${md || ''}`;
      } else if (creating === "course") {
        url = "/api/courses/upload-markdown";
        payload.type = "course";
        payload.nivel = nivel;
        payload.courseTime = courseTime;
        payload.md = md;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error HTTP ${res.status}`);
      }
      setStatus("Creado correctamente");
      resetForm();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  if (!authed) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Acceso Admin</h1>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="Contraseña"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Entrar
        </button>
        {status && <p className="mt-3 text-sm text-gray-600">{status}</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Panel Admin</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["article", "resource", "course"] as CreateType[]).map((t) => (
          <button
            key={t}
            onClick={() => setCreating(t)}
            className={`px-3 py-1 rounded border ${
              creating === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 border-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="título" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="autor" value={author} onChange={(e) => setAuthor(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="tags (separadas por coma)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="fecha (YYYY-MM-DD)" value={date} onChange={(e) => setDate(e.target.value)} />
          <textarea className="w-full border rounded px-3 py-2" placeholder="extracto" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          <textarea className="w-full border rounded px-3 py-2 min-h-40" placeholder="Contenido Markdown (MD)" value={md} onChange={(e) => setMd(e.target.value)} />
        </div>

        <div className="space-y-3">
          {creating === "resource" && (
            <>
              <input className="w-full border rounded px-3 py-2" placeholder="tipo (libro, video, etc.)" value={type} onChange={(e) => setType(e.target.value)} />
              <input className="w-full border rounded px-3 py-2" placeholder="link de descarga" value={link} onChange={(e) => setLink(e.target.value)} />
              <input className="w-full border rounded px-3 py-2" placeholder="url de imagen" value={image} onChange={(e) => setImage(e.target.value)} />
            </>
          )}
          {creating === "course" && (
            <>
              <input className="w-full border rounded px-3 py-2" placeholder="nivel" value={nivel} onChange={(e) => setNivel(e.target.value)} />
              <input className="w-full border rounded px-3 py-2" placeholder="duración (ej. 3h 20m)" value={courseTime} onChange={(e) => setCourseTime(e.target.value)} />
            </>
          )}

          <button
            onClick={createContent}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Crear {creating}
          </button>
          {status && <p className="text-sm text-gray-600">{status}</p>}
        </div>
      </div>
    </div>
  );
}
