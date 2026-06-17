import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { FormEvent } from "react";
import { apiFetch } from "./lib/api";

type Provider = {
  id: string;
  name: string;
  slug: string;
  baseUrl: string | null;
  specUrl: string | null;
  authType: string;
  isActive: boolean;
  createdAt: string;
};

type ProvidersResponse = {
  data: Provider[];
};

export default function App() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [specUrl, setSpecUrl] = useState("");
  const [authType, setAuthType] = useState("none");

  const { data, isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: () => apiFetch<ProvidersResponse>("/providers"),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, string> = {
        name: name.trim(),
        slug: slug.trim(),
        authType,
      };

      if (baseUrl.trim()) {
        payload.baseUrl = baseUrl.trim();
      }

      if (specUrl.trim()) {
        payload.specUrl = specUrl.trim();
      }

      return apiFetch("/providers", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      setName("");
      setSlug("");
      setBaseUrl("");
      setSpecUrl("");
      setAuthType("none");
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      alert("Name and slug are required");
      return;
    }

    createMutation.mutate();
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Provider Registry</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Provider name" />
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="provider-slug" />
        <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="Base URL" />
        <input value={specUrl} onChange={(e) => setSpecUrl(e.target.value)} placeholder="Spec URL" />
        <select value={authType} onChange={(e) => setAuthType(e.target.value)}>
          <option value="none">none</option>
          <option value="apiKey">apiKey</option>
          <option value="bearer">bearer</option>
          <option value="basic">basic</option>
        </select>
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create provider"}
        </button>

        {createMutation.error instanceof Error && (
          <p style={{ color: "red", marginTop: 8 }}>{createMutation.error.message}</p>
        )}
      </form>

      <section style={{ marginTop: 32 }}>
        <h2>Providers</h2>
        {isLoading && <p>Loading...</p>}
        {error instanceof Error && <p>{error.message}</p>}
        <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
          {data?.data.map((provider) => (
            <li key={provider.id} style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
              <strong>{provider.name}</strong>
              <div>Slug: {provider.slug}</div>
              <div>Base URL: {provider.baseUrl ?? "-"}</div>
              <div>Spec URL: {provider.specUrl ?? "-"}</div>
              <div>Auth: {provider.authType}</div>
              <div>Status: {provider.isActive ? "Active" : "Inactive"}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}