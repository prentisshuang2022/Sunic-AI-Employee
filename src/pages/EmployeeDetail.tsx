import { useParams } from "react-router-dom";
import {
  Edit,
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
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ENTITY = "武汉三工光电设备制造有限公司";

// mock 单条员工数据
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
  formerContractStart: "2020-05-20",
  formerContractEnd: "2023-05-19",
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
  certifyStatus: "已认证",
  hireDate: "2020-05-20",
  completeness: 75,
  idEnd: "2025-12-15",
  idStatus: "soon" as const,
};

export default function EmployeeDetail() {
  const { id } = useParams();

  return (
    <>
      <PageHeader
        title={`${EMP.name} · 员工档案`}
        description={`${EMP.entity} · ${EMP.department} · ${EMP.position}`}
        backTo="/employees"
        backLabel="返回员工列表"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("已发送补资料通知")}>
              <BellRing className="h-4 w-4 mr-1.5" />通知补资料
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("已发起调岗")}>
              <ArrowRightLeft className="h-4 w-4 mr-1.5" />发起调岗
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("已发起离职流程")}>
              <LogOut className="h-4 w-4 mr-1.5" />发起离职
            </Button>
            <Button size="sm" onClick={() => toast.success("已同步钉钉")}>
              <RefreshCcw className="h-4 w-4 mr-1.5" />同步钉钉
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-5">
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
              <Field label="现任职务" value={EMP.position} />
              <Field label="归属地" value={EMP.region} />
            </div>
          </div>

          {EMP.completeness < 100 && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-warning/20 bg-warning/5 px-3 py-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <div>
                <span className="text-warning font-medium">资料缺失提示：</span>
                <span className="text-muted-foreground">缺少 <b className="text-foreground">紧急联系人电话备注</b>、<b className="text-foreground">学历认证扫描件</b>，建议尽快补齐。</span>
              </div>
            </div>
          )}
        </Card>

        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">基础信息</TabsTrigger>
            <TabsTrigger value="org">组织任职</TabsTrigger>
            <TabsTrigger value="contract">雇佣合同</TabsTrigger>
            <TabsTrigger value="education">身份与教育</TabsTrigger>
            <TabsTrigger value="files">资料附件</TabsTrigger>
            <TabsTrigger value="history">异动历史</TabsTrigger>
            <TabsTrigger value="system">系统记录</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <SectionCard title="基础信息卡" onEdit>
              <Field label="姓名" value={EMP.name} />
              <Field label="性别" value={EMP.gender} />
              <Field label="出生日期" value={EMP.birth} />
              <Field label="身份证号" value={
                <span className="inline-flex items-center gap-1.5">
                  {EMP.idNumber}
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px] px-1.5 py-0">即将到期 {EMP.idEnd}</Badge>
                </span>
              } />
              <Field label="手机号" value={EMP.phone} />
              <Field label="紧急联系人" value={EMP.emergency} />
            </SectionCard>
          </TabsContent>

          <TabsContent value="org">
            <SectionCard title="组织任职信息卡" onEdit>
              <Field label="合同归属" value={EMP.entity} />
              <Field label="现用人编制" value={EMP.payroll} />
              <Field label="原用人编制" value={EMP.formerPayroll} />
              <Field label="部门" value={EMP.department} />
              <Field label="现任职务" value={EMP.position} />
              <Field label="归属地" value={EMP.region} />
              <Field label="最近调岗时间" value={EMP.transferDate} />
            </SectionCard>
          </TabsContent>

          <TabsContent value="contract">
            <SectionCard title="雇佣合同信息卡" onEdit>
              <Field label="合同性质" value={EMP.contractType} />
              <Field label="现合同起止" value={`${EMP.contractStart} ~ ${EMP.contractEnd}`} />
              <Field label="到期天数" value={<span className="text-success font-medium">{EMP.contractDays} 天</span>} />
              <Field label="原合同起止" value={`${EMP.formerContractStart} ~ ${EMP.formerContractEnd}`} />
            </SectionCard>
            <Card className="p-5 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <History className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">续签 / 变更记录</h3>
              </div>
              <div className="space-y-3">
                {[
                  { date: "2023-05-20", action: "续签", desc: "续签 3 年，至 2026-05-19", op: "李 HR" },
                  { date: "2020-05-20", action: "首次签订", desc: "三工光电 · 市场部", op: "周主管" },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-4 border-l-2 border-primary/30 pl-4">
                    <div className="text-xs text-muted-foreground w-24 shrink-0 mt-0.5">{r.date}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2"><Badge variant="secondary">{r.action}</Badge></div>
                      <div className="text-sm text-muted-foreground mt-1">{r.desc} · {r.op}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <SectionCard title="身份与教育信息卡" onEdit>
              <Field label="户籍住址" value={EMP.household} />
              <Field label="民族" value={EMP.nation} />
              <Field label="籍贯" value={EMP.origin} />
              <Field label="政治面貌" value={EMP.political} />
              <Field label="婚育情况" value={EMP.marriage} />
              <Field label="学历" value={EMP.education} />
              <Field label="学历类别" value={EMP.educationType} />
              <Field label="毕业院校" value={EMP.school} />
              <Field label="毕业时间" value={EMP.graduate} />
              <Field label="专业" value={EMP.major} />
              <Field label="学历认证" value={
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />{EMP.certifyStatus}
                </Badge>
              } />
            </SectionCard>
          </TabsContent>

          <TabsContent value="files">
            <Card className="p-5">
              <h3 className="font-medium mb-4">资料附件</h3>
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
            <Card className="p-5">
              <h3 className="font-medium mb-4">异动历史</h3>
              <div className="space-y-4">
                {[
                  { date: "2024-09-01", type: "调岗", desc: "市场部 → 销售部，市场经理 → 销售主管", op: "李 HR" },
                  { date: "2023-05-20", type: "续签", desc: "合同续签至 2026-05-19", op: "周主管" },
                  { date: "2021-06-01", type: "转正", desc: "实习期 → 正式员工", op: "周主管" },
                  { date: "2020-05-20", type: "入职", desc: "三工光电 · 市场部", op: "李 HR" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-4 border-l-2 border-primary/30 pl-4">
                    <div className="text-xs text-muted-foreground w-24 shrink-0 mt-0.5 tabular-nums">{c.date}</div>
                    <div className="flex-1">
                      <Badge variant="secondary">{c.type}</Badge>
                      <div className="text-sm text-muted-foreground mt-1">{c.desc} · {c.op}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">AI 抽取记录</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { f: "身份证号", from: "身份证.jpg", confidence: 0.99 },
                    { f: "毕业院校", from: "学历证明.pdf", confidence: 0.96 },
                    { f: "合同期限", from: "劳动合同.pdf", confidence: 0.92 },
                  ].map((r) => (
                    <div key={r.f} className="flex justify-between items-center border-b py-2 last:border-0">
                      <div>
                        <div className="font-medium">{r.f}</div>
                        <div className="text-xs text-muted-foreground">来源：{r.from}</div>
                      </div>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        置信度 {(r.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCcw className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">钉钉同步记录</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { date: "2024-09-01 14:22", desc: "部门变更同步成功", ok: true },
                    { date: "2024-09-01 14:22", desc: "职务变更同步成功", ok: true },
                    { date: "2023-05-21 09:10", desc: "合同续签信息同步", ok: true },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between items-center border-b py-2 last:border-0">
                      <div>
                        <div className="text-xs text-muted-foreground tabular-nums">{r.date}</div>
                        <div>{r.desc}</div>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-success" />
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

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm mt-1 truncate">{value}</div>
    </div>
  );
}

function SectionCard({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit?: boolean }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{title}</h3>
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => toast.success("进入编辑模式")}>
            <Edit className="h-3.5 w-3.5 mr-1" />编辑
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        {children}
      </div>
    </Card>
  );
}
