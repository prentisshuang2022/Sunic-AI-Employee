import { useState } from "react";
import { CalendarClock, Repeat2, ClipboardCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

const tabs = [
  { value: "exceptions", label: "考勤异常", icon: CalendarClock, hint: "异常识别 · AI 核验 · 批量处理" },
  { value: "leave-balance", label: "调休管理", icon: Repeat2, hint: "加班-调休-冲抵闭环" },
  { value: "monthly-review", label: "月度复核", icon: ClipboardCheck, hint: "月底闭环 · 异常确认 · 台账导出" },
] as const;

export default function Attendance() {
  const [tab, setTab] = useState<(typeof tabs)[number]["value"]>("exceptions");

  return (
    <div className="flex flex-col">
      <PageHeader
        title="考勤助手"
        description="考勤异常 · 调休管理 · 月度复核 · 一站式闭环"
      />

      <div className="p-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="space-y-6">
          <TabsList className="h-auto bg-muted/50 p-1">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value} className="m-0">
              <div className="rounded-xl border border-dashed bg-card p-12 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <t.icon className="h-5 w-5" />
                </div>
                <h2 className="text-base font-medium">{t.label}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.hint} · 告诉我「实现这一 Tab」即可按原型 1:1 还原。
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

// Re-export for backwards-compat with prior placeholder pages (no longer routed).
export { PlaceholderPage };
