import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  RefreshCcw,
  ArrowRightLeft,
  LogOut,
  BellRing,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Sparkles,
  Paperclip,
  History,
  CloudUpload,
  GitCompare,
  CircleDot,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ENTITY = "武汉三工光电设备制造有限公司";

interface FieldMeta {
  source: "钉钉" | "本系统" | "AI识别";
  syncedAt: string;
  diff?: { dingtalk: string; system: string };
}

const EMP = {
  id: "E003",
  name: "张伟",
  gender: "男",
  birth: "1988-06-12",
  idNumber: "42010619880612****",
  phone: "137****6612",
  emergency: "李丽 / 137****1230",
  entity: ENTITY,
  payroll: "三工光电 · 销售编制",
  formerPayroll: "三工光电 · 市场编制",
  department: "销售部",
  position: "销售主管",
  region: "湖北 武汉",
  transferDate: "2024-09-01",
  contractType: "固定期限劳动合同",
  contractStart: "2023-05-20",
  contractEnd: "2026-05-19",
  contractDays: 395,
  household: "湖北省武汉市江夏区",
  nation: "汉族",
  origin: "湖北 黄冈",
  political: "中共党员",
  marriage: "已婚已育",
  education: "本科",
  educationType: "全日制",
  school: "武汉理工大学",
  graduate: "2010-07",
  major: "光电信息工程",
  hireDate: "2020-05-20",
  completeness: 75,
  idEnd: "2025-12-15",
  lastSyncAt: "2025-04-14 11:08",
};

const FIELD_META: Record<string, FieldMeta> = {
  姓名: { source: "钉钉", syncedAt: "2025-04-14 11:08" },
  性别: { source: "钉钉", syncedAt: "2025-04-14 11:08" },
  出生日期: { source: "AI识别", syncedAt: "2020-05-20 10:00" },
  身份证号: { source: "AI识别", syncedAt: "2020-05-20 10:00" },
  手机号: { source: "钉钉", syncedAt: "2025-04-14 11:08" },
  紧急联系人: { source: "本系统", syncedAt: "2024-09-01 14:00" },
  部门: { source: "钉钉", syncedAt: "2025-04-14 11:08" },
  现任职务: {
    source: "钉钉",
    syncedAt: "2025-04-14 11:08",
    diff: { dingtalk: "销售总监", system: "销售主管" },
  },
  归属地: { source: "钉钉", syncedAt: "2025-04-14 11:08" },
  合同性质: { source: "AI识别", syncedAt: "2023-05-20 10:00" },
  毕业院校: { source: "AI识别", syncedAt: "2020-05-20 10:00" },
};

export default function EmployeeDetail() {
  useParams(); // id
  const [diffOnly, setDiffOnly] = useState(false);

  const diffCount = Object.values(FIELD_META).filter((m) => m.diff).length;

  return (
    <>
      <PageHeader
        title={`${EMP.name} · 员工档案`}
        description={`${EMP.entity} · ${EMP.department} · ${EMP.position}`}
        backTo="/employees"
        backLabel="返回员工列表"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("已通过钉钉发送提醒")}>
              <BellRing className="h-4 w-4 mr-1.5" />钉钉提醒
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("已发起调岗")}>
              <ArrowRightLeft className="h-4 w-4 mr-1.5" />发起调岗
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("已发起离职流程")}>
              <LogOut className="h-4 w-4 mr-1.5" />发起离职
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-5">
        {/* 钉钉同步横幅 */}
        <Card className={cn(
          "p-4",
          diffCount > 0 ? "border-warning/30 bg-warning/5" : "border-success/30 bg-success/5"
        )}>
          <div className="flex flex-wrap items-center gap-4">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
              diffCount > 0 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
            )}>
              {diffCount > 0 ? <GitCompare className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="text-sm font-medium">
                {diffCount > 0 ? `检测到 ${diffCount} 项与钉钉的差异` : "档案与钉钉一致"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                <CircleDot className="h-3 w-3 inline mr-1" />
                上次同步 <span className="tabular-nums">{EMP.lastSyncAt}</span>
                {diffCount > 0 && " · 差异字段已在下方高亮"}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {diffCount > 0 && (
                <Button
                  size="sm"
                  variant={diffOnly ? "default" : "outline"}
                  onClick={() => setDiffOnly(!diffOnly)}
                >
                  仅看差异
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => toast.success("已从钉钉拉取最新")}>
                <ArrowDownToLine className="h-4 w-4 mr-1.5" />从钉钉拉取
              </Button>
              <Button size="sm" onClick={() => toast.success("已推送到钉钉")}>
                <ArrowUpFromLine className="h-4 w-4 mr-1.5" />推送钉钉
              </Button>
            </div>
          </div>
        </Card>

        {/* 顶部员工卡 */}
        <Card className="p-5">
          <div className="flex items-start gap-5">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">{EMP.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
              <Field label="工号" value={EMP.id} />
              <Field label="状态" value={<Badge variant="outline" className="bg-success/10 text-success border-success/20">在职</Badge>} />
              <Field label="入职时间" value={EMP.hireDate} />
              <Field label="资料完整度" value={
                <span className={cn("font-medium", EMP.completeness < 100 ? "text-warning" : "text-success")}>
                  {EMP.completeness}%
                </span>
              } />
              <Field label="手机号" value={EMP.phone} />
              <Field label="部门" value={EMP.department} />
              <Field label="现任职务" value={EMP.position} meta={FIELD_META["现任职务"]} />
              <Field label="归属地" value={EMP.region} />
            </div>
          </div>

          {EMP.completeness < 100 && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-warning/20 bg-warning/5 px-3 py-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-warning font-medium">资料缺失：</span>
                <span className="text-muted-foreground">缺少 <b className="text-foreground">学历认证扫描件</b>，请通过「补录附件」上传。</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("已打开附件上传")}>
                <Paperclip className="h-3.5 w-3.5 mr-1" />补录附件
              </Button>
            </div>
          )}
        </Card>

        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">基础信息</TabsTrigger>
            <TabsTrigger value="org">组织任职 {diffCount > 0 && <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px] bg-warning/15 text-warning">{diffCount}</Badge>}</TabsTrigger>
            <TabsTrigger value="contract">雇佣合同</TabsTrigger>
            <TabsTrigger value="education">身份与教育</TabsTrigger>
            <TabsTrigger value="files">资料附件</TabsTrigger>
            <TabsTrigger value="history">异动 / 同步记录</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <SectionCard title="基础信息卡" hint="钉钉为主数据源">
              <Field label="姓名" value={EMP.name} meta={FIELD_META["姓名"]} hide={diffOnly && !FIELD_META["姓名"].diff} />
              <Field label="性别" value={EMP.gender} meta={FIELD_META["性别"]} hide={diffOnly && !FIELD_META["性别"].diff} />
              <Field label="出生日期" value={EMP.birth} meta={FIELD_META["出生日期"]} hide={diffOnly} />
              <Field label="身份证号" value={
                <span className="inline-flex items-center gap-1.5">
                  {EMP.idNumber}
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px] px-1.5 py-0">即将到期 {EMP.idEnd}</Badge>
                </span>
              } meta={FIELD_META["身份证号"]} hide={diffOnly} />
              <Field label="手机号" value={EMP.phone} meta={FIELD_META["手机号"]} hide={diffOnly && !FIELD_META["手机号"].diff} />
              <Field label="紧急联系人" value={EMP.emergency} meta={FIELD_META["紧急联系人"]} hide={diffOnly} />
            </SectionCard>
          </TabsContent>

          <TabsContent value="org">
            <SectionCard title="组织任职信息卡" hint="本卡所有字段以钉钉为准">
              <Field label="合同归属" value={EMP.entity} hide={diffOnly} />
              <Field label="现用人编制" value={EMP.payroll} hide={diffOnly} />
              <Field label="原用人编制" value={EMP.formerPayroll} hide={diffOnly} />
              <Field label="部门" value={EMP.department} meta={FIELD_META["部门"]} hide={diffOnly && !FIELD_META["部门"].diff} />
              <Field label="现任职务" value={EMP.position} meta={FIELD_META["现任职务"]} />
              <Field label="归属地" value={EMP.region} meta={FIELD_META["归属地"]} hide={diffOnly && !FIELD_META["归属地"].diff} />
              <Field label="最近调岗" value={EMP.transferDate} hide={diffOnly} />
            </SectionCard>
          </TabsContent>

          <TabsContent value="contract">
            <SectionCard title="雇佣合同信息卡" hint="本系统维护，可推送到钉钉">
              <Field label="合同性质" value={EMP.contractType} meta={FIELD_META["合同性质"]} />
              <Field label="现合同起止" value={`${EMP.contractStart} ~ ${EMP.contractEnd}`} />
              <Field label="到期天数" value={<span className="text-success font-medium">{EMP.contractDays} 天</span>} />
            </SectionCard>
          </TabsContent>

          <TabsContent value="education">
            <SectionCard title="身份与教育信息卡" hint="AI 识别 + 本系统维护">
              <Field label="户籍住址" value={EMP.household} />
              <Field label="民族" value={EMP.nation} />
              <Field label="籍贯" value={EMP.origin} />
              <Field label="政治面貌" value={EMP.political} />
              <Field label="婚育情况" value={EMP.marriage} />
              <Field label="学历" value={EMP.education} />
              <Field label="毕业院校" value={EMP.school} meta={FIELD_META["毕业院校"]} />
              <Field label="毕业时间" value={EMP.graduate} />
              <Field label="专业" value={EMP.major} />
              <Field label="学历认证" value={
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />已认证
                </Badge>
              } />
            </SectionCard>
          </TabsContent>

          <TabsContent value="files">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">资料附件</h3>
                <Button size="sm" variant="outline" onClick={() => toast.success("已打开附件上传")}>
                  <Paperclip className="h-3.5 w-3.5 mr-1" />补录附件
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { name: "身份证 · 正面", type: "JPG", ok: true },
                  { name: "身份证 · 反面", type: "JPG", ok: true },
                  { name: "学历证明", type: "PDF", ok: true },
                  { name: "劳动合同", type: "PDF", ok: true },
                  { name: "学历认证扫描件", type: "—", ok: false },
                ].map((f) => (
                  <Card key={f.name} className={cn(
                    "p-3 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow cursor-pointer",
                    !f.ok && "border-dashed bg-muted/30"
                  )}>
                    <div className={cn("h-12 w-12 rounded-md flex items-center justify-center",
                      f.ok ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {f.ok ? <FileText className="h-6 w-6" /> : <Paperclip className="h-6 w-6" />}
                    </div>
                    <div className="text-xs font-medium truncate w-full">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground">{f.ok ? f.type : "待上传"}</div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">异动历史</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { date: "2024-09-01", type: "调岗", desc: "市场部 → 销售部", op: "李 HR" },
                    { date: "2023-05-20", type: "续签", desc: "续签至 2026-05-19", op: "周主管" },
                    { date: "2021-06-01", type: "转正", desc: "实习 → 正式", op: "周主管" },
                    { date: "2020-05-20", type: "入职", desc: "市场部", op: "李 HR" },
                  ].map((c, i) => (
                    <div key={i} className="flex items-start gap-3 border-l-2 border-primary/30 pl-3">
                      <div className="text-xs text-muted-foreground w-20 shrink-0 mt-0.5 tabular-nums">{c.date}</div>
                      <div className="flex-1">
                        <Badge variant="secondary" className="text-xs">{c.type}</Badge>
                        <div className="text-xs text-muted-foreground mt-1">{c.desc} · {c.op}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCcw className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">钉钉同步记录</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { date: "2025-04-14 11:08", desc: "钉钉推送：现任职务变更", dir: "in", ok: true },
                    { date: "2024-09-01 14:22", desc: "本系统下推：部门变更", dir: "out", ok: true },
                    { date: "2024-09-01 14:22", desc: "本系统下推：职务变更", dir: "out", ok: true },
                    { date: "2023-05-21 09:10", desc: "本系统下推：合同续签", dir: "out", ok: true },
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className={cn(
                        "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
                        r.dir === "in" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                      )}>
                        {r.dir === "in" ? <ArrowDownToLine className="h-3.5 w-3.5" /> : <ArrowUpFromLine className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground tabular-nums">{r.date}</div>
                        <div>{r.desc}</div>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-success mt-1.5" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5 md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">AI 抽取记录</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { f: "身份证号", from: "身份证.jpg", confidence: 0.99 },
                    { f: "毕业院校", from: "学历证明.pdf", confidence: 0.96 },
                    { f: "合同期限", from: "劳动合同.pdf", confidence: 0.92 },
                  ].map((r) => (
                    <div key={r.f} className="border rounded-md p-3">
                      <div className="font-medium text-sm">{r.f}</div>
                      <div className="text-xs text-muted-foreground mt-1">来源：{r.from}</div>
                      <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
                        置信度 {(r.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function Field({ label, value, meta, hide }: { label: string; value: React.ReactNode; meta?: FieldMeta; hide?: boolean }) {
  if (hide) return null;
  const hasDiff = !!meta?.diff;
  return (
    <div className={cn(
      "min-w-0 -mx-2 px-2 py-1 rounded-md",
      hasDiff && "bg-warning/5 ring-1 ring-warning/30"
    )}>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        {meta && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(
                "inline-flex items-center gap-0.5 text-[10px] px-1 py-px rounded-sm cursor-help",
                meta.source === "钉钉" && "bg-primary/10 text-primary",
                meta.source === "AI识别" && "bg-accent/15 text-accent-foreground border border-accent/20",
                meta.source === "本系统" && "bg-muted text-muted-foreground"
              )}>
                {meta.source}
              </span>
            </TooltipTrigger>
            <TooltipContent>来源：{meta.source} · 同步于 {meta.syncedAt}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="text-sm mt-1 truncate">{value}</div>
      {hasDiff && meta?.diff && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-normal">
            钉钉值：{meta.diff.dingtalk}
          </Badge>
          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-primary hover:text-primary" onClick={() => toast.success(`已采用钉钉值：${meta.diff!.dingtalk}`)}>
            采用
          </Button>
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium">{title}</h3>
          {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
        </div>
        <Button variant="ghost" size="sm" onClick={() => toast.success("已推送本卡到钉钉")}>
          <CloudUpload className="h-3.5 w-3.5 mr-1" />推送本卡
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        {children}
      </div>
    </Card>
  );
}
