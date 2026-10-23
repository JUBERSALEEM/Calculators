// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from "vitest";
import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { CALCULATORS, getCategories } from "@/calculators/registry";
import { DOMAIN_GROUPS, groupForCategoryCode } from "@/calculators/domain-map";
import { AllCalculatorsTree, type TreeGroup } from "./all-tree";

beforeAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

function buildGroups(): TreeGroup[] {
  const categories = getCategories();
  return DOMAIN_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    categories: categories
      .filter((c) => groupForCategoryCode(c.code) === g.id)
      .map((c) => ({
        code: c.code,
        slug: c.slug,
        label: c.label,
        items: CALCULATORS.filter((x) => x.category === c.code).map((x) => ({
          slug: x.slug,
          name: x.name,
          formulaStatus: x.formulaStatus,
        })),
      })),
  }));
}

function render(groups: TreeGroup[]) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root: Root = createRoot(host);
  act(() => root.render(<AllCalculatorsTree groups={groups} />));
  return { host, root };
}

function categoryButton(host: HTMLElement, code: string) {
  const b = host.querySelector<HTMLButtonElement>(`button[aria-controls="cat-${code}"]`);
  if (!b) throw new Error(`no button for ${code}`);
  return b;
}

describe("AllCalculatorsTree", () => {
  it("lists every discipline and all 84 categories, collapsed by default", () => {
    const { host, root } = render(buildGroups());
    expect(host.querySelectorAll("section").length).toBe(DOMAIN_GROUPS.length);
    expect(host.querySelectorAll("button[aria-controls]").length).toBe(getCategories().length);
    expect(host.querySelectorAll('a[href^="/calculators/"]').length).toBe(0);
    act(() => root.unmount());
    host.remove();
  });

  it("expands a category on click and collapses it on a second click", () => {
    const { host, root } = render(buildGroups());
    const cat = getCategories()[0]!;
    const expected = CALCULATORS.filter((c) => c.category === cat.code);
    const btn = categoryButton(host, cat.code);
    expect(btn.getAttribute("aria-expanded")).toBe("false");

    act(() => btn.click());
    expect(categoryButton(host, cat.code).getAttribute("aria-expanded")).toBe("true");
    const links = host.querySelectorAll(`#cat-${cat.code} a`);
    expect(links.length).toBe(expected.length);
    expect(links[0]!.getAttribute("href")).toBe(`/calculators/${expected[0]!.slug}`);

    act(() => categoryButton(host, cat.code).click());
    expect(host.querySelector(`#cat-${cat.code}`)).toBeNull();
    act(() => root.unmount());
    host.remove();
  });

  it("Expand all shows every calculator link", () => {
    const { host, root } = render(buildGroups());
    const expandAll = [...host.querySelectorAll("button")].find((b) => b.textContent === "Expand all")!;
    act(() => expandAll.click());
    expect(host.querySelectorAll('a[href^="/calculators/"]').length).toBe(CALCULATORS.length);
    act(() => root.unmount());
    host.remove();
  });

  it("filtering by name shows matching calculators and opens their categories", () => {
    const { host, root } = render(buildGroups());
    const input = host.querySelector<HTMLInputElement>("#tree-search")!;
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setter.call(input, "compound interest");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const links = [...host.querySelectorAll<HTMLAnchorElement>('a[href^="/calculators/"]')];
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((a) => /interest/i.test(a.textContent ?? "") || a.getAttribute("href")!.includes("interest"))).toBe(true);
    act(() => root.unmount());
    host.remove();
  });
});
