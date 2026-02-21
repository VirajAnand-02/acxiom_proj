import { useEffect, useRef } from "react";

type Props = {
  chart: string;
};

export function MermaidChart({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    import("mermaid").then((mermaid) => {
      if (!mounted || !ref.current) {
        return;
      }
      mermaid.default.initialize({ startOnLoad: false, securityLevel: "loose", theme: "default" });
      mermaid.default
        .render("event-flowchart", chart)
        .then((result) => {
          if (ref.current) {
            ref.current.innerHTML = result.svg;
          }
        })
        .catch(() => {
          if (ref.current) {
            ref.current.innerText = "Unable to render chart.";
          }
        });
    });

    return () => {
      mounted = false;
    };
  }, [chart]);

  return <div ref={ref} className="overflow-x-auto rounded border bg-white p-3" aria-label="Flowchart" />;
}
