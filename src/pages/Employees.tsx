import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileWarning,
  IdCard,
  Users,
  RefreshCcw,
  Search,
  Filter,
  Upload,
  Download,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  MoreHorizontal,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ContractStatus = "normal" | "soon" | "expired";
type IdStatus = "normal" | "soon" | "expired";
type EmployeeStatus = "active" | "leaving" | "pending";

interface EmployeeRow {
  id: string;
  name: string;
  status: EmployeeStatus;
  entity: string; // 合同归属
  department: string;
  position: string;
  hireDate: string;
  contractEnd: string;
  contractStatus: ContractStatus;
  idEnd: string;
  idStatus: IdStatus;
  completeness: number;
  lastChange: string;
  phone: string;
  education: string;
}

const ENTITY = "武汉三工光电设备制造有限公司";

const MOCK: EmployeeRow[] = [
  { id: "E001", name: "李明", status: "active", entity: ENTITY, department: "激光技术部", position: "高级激光工程师", hireDate: "2022-03-15", contractEnd: "2026-03-14", contractStatus: "normal", idEnd: "2031-08-12", idStatus: "normal", completeness: 100, lastChange: "转正", phone: "138****2381", education: "硕士" },
  { id: "E002", name: "王芳", status: "active", entity: ENTITY, department: "市场部", position: "市场经理", hireDate: "2021-08-01", contractEnd: "2025-12-30", contractStatus: "soon", idEnd: "2029-04-22", idStatus: "normal", completeness: 100, lastChange: "部门变动，需同步钉钉", phone: "139****1102", education: "本科" },
  { id: "E003", name: "张伟", status: "active", entity: ENTITY, department: "销售部", position: "销售主管", hireDate: "2020-05-20", contractEnd: "2026-05-19", contractStatus: "normal", idEnd: "2025-12-15", idStatus: "soon", completeness: 75, lastChange: "岗位变动，需同步", phone: "137****6612", education: "本科" },
  { id: "E004", name: "刘洋", status: "active", entity: ENTITY, department: "技术研发中心", position: "前端开发", hireDate: "2023-01-10", contractEnd: "2026-01-09", contractStatus: "normal", idEnd: "2030-09-01", idStatus: "normal", completeness: 100, lastChange: "入职", phone: "186****8821", education: "本科" },
  { id: "E005", name: "陈静", status: "active", entity: ENTITY, department: "技术研发中心", position: "后端开发", hireDate: "2023-06-01", contractEnd: "2026-05-31", contractStatus: "normal", idEnd: "2032-02-18", idStatus: "normal", completeness: 75, lastChange: "入职", phone: "159****3344", education: "本科" },
  { id: "E006", name: "黄磊", status: "active", entity: ENTITY, department: "产品部", position: "产品经理", hireDate: "2022-11-15", contractEnd: "2025-11-14", contractStatus: "expired", idEnd: "2028-07-30", idStatus: "normal", completeness: 100, lastChange: "调岗", phone: "188****9092", education: "硕士" },
  { id: "E007", name: "赵强", status: "active", entity: ENTITY, department: "光学装配车间", position: "装配技师", hireDate: "2019-04-08", contractEnd: "2026-04-07", contractStatus: "normal", idEnd: "2025-11-20", idStatus: "soon", completeness: 80, lastChange: "续签", phone: "135****4471", education: "大专" },
  { id: "E008", name: "周敏", status: "active", entity: ENTITY, department: "财务部", position: "会计主管", hireDate: "2018-09-12", contractEnd: "2027-09-11", contractStatus: "normal", idEnd: "2033-05-04", idStatus: "normal", completeness: 100, lastChange: "—", phone: "131****0908", education: "本科" },
];

const stats = [
  { key: "contract", label: "合同30天内到期", value: 3, icon: FileWarning, accent: "text-destructive bg-destructive/10" },
  { key: "id", label: "身份证30天内到期", value: 2, icon: IdCard, accent: "text-warning bg-warning/10" },
  { key: "missing", label: "待补资料", value: 5, icon: Users, accent: "text-primary bg-primary/10" },
  { key: "sync", label: "待同步钉钉", value: 4, icon: RefreshCcw, accent: "text-muted-foreground bg-muted" },
];

const StatusBadge = ({ status }: { status: EmployeeStatus }) => {
  const map = {
    active: { label: "在职", cls: "bg-success/10 text-success border-success/20" },
    leaving: { label: "离职中", cls: "bg-warning/10 text-warning border-warning/20" },
    pending: { label: "待入职", cls: "bg-muted text-muted-foreground" },
  } as const;
  return <Badge variant="outline" className={cn("font-normal", map[status].cls)}>{map[status].label}</Badge>;
};

const ContractCell = ({ status, date }: { status: ContractStatus; date: string }) => {
  if (status === "expired")
    return <span className="inline-flex items-center gap-1 text-destructive"><AlertTriangle className="h-3.5 w-3.5" />已到期</span>;
  if (status === "soon")
    return <span className="inline-flex items-center gap-1 text-warning"><AlertTriangle className="h-3.5 w-3.5" />即将到期</span>;
  return <span className="text-success">正常</span>;
};

const IdCell = ({ status }: { status: IdStatus }) => {
  if (status === "expired")
    return <span className="inline-flex items-center gap-1 text-destructive"><AlertTriangle className="h-3.5 w-3.5" />已到期</span>;
  if (status === "soon")
    return <span className="inline-flex items-center gap-1 text-warning"><AlertTriangle className="h-3.5 w-3.5" />即将到期</span>;
  return <span className="text-success">正常</span>;
};

export default function Employees() {
  const [tab, setTab] = useState("list");
  const [keyword, setKeyword] = useState("");
  const [department, setDepartment] = useState<string>("all");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [completenessFilter, setCompletenessFilter] = useState<string>("all");
  const [statFilter, setStatFilter] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const departments = useMemo(
    () => Array.from(new Set(MOCK.map((m) => m.department))),
    []
  );

  const filtered = useMemo(() => {
    return MOCK.filter((r) => {
      if (keyword) {
        const k = keyword.toLowerCase();
        if (![r.name, r.phone, r.department, r.position].some((v) => v.toLowerCase().includes(k))) return false;
      }
      if (department !== "all" && r.department !== department) return false;
      if (contractFilter !== "all" && r.contractStatus !== contractFilter) return false;
      if (completenessFilter === "complete" && r.completeness < 100) return false;
      if (completenessFilter === "missing" && r.completeness >= 100) return false;
      if (statFilter === "contract" && r.contractStatus === "normal") return false;
      if (statFilter === "id" && r.idStatus === "normal") return false;
      if (statFilter === "missing" && r.completeness >= 100) return false;
      return true;
    });
  }, [keyword, department, contractFilter, completenessFilter, statFilter]);

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? filtered.map((r) => r.id) : []);
  };
  const toggleOne = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  return (
    <>
      <PageHeader
        title="员工档案管理"
        description="武汉三工光电 · 统一管理在职员工主数据、证件、合同与异动"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("已触发数据同步")}>
              <RefreshCcw className="h-4 w-4 mr-1.5" />数据同步
            </Button>
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
              <Upload className="h-4 w-4 mr-1.5" />导入资料
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success(`已导出 ${filtered.length} 条`)}>
              <Download className="h-4 w-4 mr-1.5" />批量导出
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-5">
        {/* 顶部 4 个统计卡 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const active = statFilter === s.key;
            const Icon = s.icon;
            return (
              <Card
                key={s.key}
                onClick={() => setStatFilter(active ? null : s.key)}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:shadow-md flex items-center gap-3",
                  active && "ring-2 ring-primary"
                )}
              >
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", s.accent)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-muted-foreground truncate">{s.label}</div>
                  <div className="text-2xl font-semibold mt-0.5">{s.value}</div>
                </div>
              </Card>
            );
          })}
        </div>

        {statFilter && (
          <div className="text-xs text-muted-foreground inline-flex items-center gap-2">
            已按「{stats.find((s) => s.key === statFilter)?.label}」过滤
            <button onClick={() => setStatFilter(null)} className="text-primary hover:underline inline-flex items-center gap-1">
              <X className="h-3 w-3" /> 清除
            </button>
          </div>
        )}

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="list">员工列表</TabsTrigger>
            <TabsTrigger value="changes">异动记录</TabsTrigger>
            <TabsTrigger value="reminders">到期提醒</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* 筛选栏 */}
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索姓名、手机号、身份证号、部门…"
                    className="pl-9"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="部门" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部部门</SelectItem>
                    {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={contractFilter} onValueChange={setContractFilter}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="合同状态" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部合同</SelectItem>
                    <SelectItem value="normal">正常</SelectItem>
                    <SelectItem value="soon">即将到期</SelectItem>
                    <SelectItem value="expired">已到期</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={completenessFilter} onValueChange={setCompletenessFilter}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="资料完整度" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="complete">完整</SelectItem>
                    <SelectItem value="missing">有缺失</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => { setKeyword(""); setDepartment("all"); setContractFilter("all"); setCompletenessFilter("all"); setStatFilter(null); }}>
                  <Filter className="h-4 w-4 mr-1.5" />重置
                </Button>
              </div>

              {selected.length > 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-primary/5 border border-primary/20 px-3 py-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  已选 <span className="font-medium">{selected.length}</span> 名员工
                  <div className="flex-1" />
                  <Button size="sm" variant="outline" onClick={() => toast.success("提醒已发送")}>提醒补资料</Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("已加入钉钉同步队列")}>同步钉钉</Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelected([])}>取消</Button>
                </div>
              )}
            </Card>

            {/* 表格 */}
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border"
                        checked={selected.length > 0 && selected.length === filtered.length}
                        onChange={(e) => toggleAll(e.target.checked)}
                      />
                    </TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>员工状态</TableHead>
                    <TableHead>合同归属</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>现任职务</TableHead>
                    <TableHead>入职时间</TableHead>
                    <TableHead>合同到期</TableHead>
                    <TableHead>身份证到期</TableHead>
                    <TableHead>资料完整度</TableHead>
                    <TableHead>最新变动</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-border"
                          checked={selected.includes(r.id)}
                          onChange={() => toggleOne(r.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link to={`/employees/${r.id}`} className="font-medium text-foreground hover:text-primary">{r.name}</Link>
                      </TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="max-w-[160px] truncate text-muted-foreground" title={r.entity}>{r.entity}</TableCell>
                      <TableCell>{r.department}</TableCell>
                      <TableCell>{r.position}</TableCell>
                      <TableCell className="text-muted-foreground">{r.hireDate}</TableCell>
                      <TableCell><ContractCell status={r.contractStatus} date={r.contractEnd} /></TableCell>
                      <TableCell><IdCell status={r.idStatus} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress value={r.completeness} className="h-1.5 flex-1" />
                          <span className={cn("text-xs tabular-nums", r.completeness < 100 ? "text-warning" : "text-success")}>
                            {r.completeness}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate text-muted-foreground" title={r.lastChange}>{r.lastChange}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link to={`/employees/${r.id}`}>查看详情</Link></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success("已发起调岗")}>发起调岗</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success("已发起离职流程")}>发起离职</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success("已同步钉钉")}>同步钉钉</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={12} className="text-center text-muted-foreground py-10">没有匹配的员工</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="changes">
            <Card className="p-6">
              <div className="space-y-4">
                {[
                  { date: "2025-04-15", name: "黄磊", type: "调岗", desc: "产品部 → 产品总监", op: "李 HR" },
                  { date: "2025-04-10", name: "陈静", type: "入职", desc: "技术研发中心 · 后端开发", op: "李 HR" },
                  { date: "2025-04-02", name: "王芳", type: "续签", desc: "合同续签至 2025-12-30", op: "周主管" },
                  { date: "2025-03-28", name: "刘洋", type: "转正", desc: "实习 → 正式", op: "李 HR" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-4 border-l-2 border-primary/30 pl-4">
                    <div className="text-xs text-muted-foreground w-24 shrink-0 mt-0.5 tabular-nums">{c.date}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        <Badge variant="secondary">{c.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{c.desc} · 操作人 {c.op}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reminders">
            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {MOCK.filter((m) => m.contractStatus !== "normal" || m.idStatus !== "normal").map((r) => (
                  <Card key={r.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/employees/${r.id}`} className="font-medium hover:text-primary">{r.name}</Link>
                        <div className="text-xs text-muted-foreground mt-0.5">{r.department} · {r.position}</div>
                      </div>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">需处理</Badge>
                    </div>
                    <div className="mt-3 space-y-1.5 text-sm">
                      {r.contractStatus !== "normal" && (
                        <div className="flex justify-between"><span className="text-muted-foreground">合同到期</span><span className={r.contractStatus === "expired" ? "text-destructive" : "text-warning"}>{r.contractEnd}</span></div>
                      )}
                      {r.idStatus !== "normal" && (
                        <div className="flex justify-between"><span className="text-muted-foreground">身份证到期</span><span className="text-warning">{r.idEnd}</span></div>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.success("已发送提醒")}>提醒员工</Button>
                      <Button size="sm" variant="outline" onClick={() => toast.success("已发起续签")}>发起续签</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 导入资料弹窗 */}
      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}

function ImportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<string | null>(null);

  const handleStart = () => {
    if (!file) { toast.error("请先上传文件"); return; }
    toast.success("AI 识别中…");
    setTimeout(() => setStep(2), 800);
  };

  const handleConfirm = () => {
    toast.success("已生成员工档案");
    setStep(3);
    setTimeout(() => { onOpenChange(false); setStep(1); setFile(null); }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setStep(1); setFile(null); } }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>导入资料</DialogTitle>
          <DialogDescription>上传身份证、学历证明、合同、简历等，AI 自动识别并生成员工档案</DialogDescription>
        </DialogHeader>

        {/* steps */}
        <div className="flex items-center gap-2 text-sm">
          {[
            { n: 1, t: "上传资料" },
            { n: 2, t: "确认信息" },
            { n: 3, t: "完成建档" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium",
                step >= s.n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>{s.n}</div>
              <span className={step >= s.n ? "text-foreground" : "text-muted-foreground"}>{s.t}</span>
              {i < 2 && <div className="w-8 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="grid md:grid-cols-[1fr_240px] gap-4">
            <label className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div className="mt-3 font-medium">点击或拖拽文件到此处上传</div>
              <div className="text-xs text-muted-foreground mt-1">支持 JPG、PNG、PDF，单个不超过 10MB</div>
              {file && <div className="mt-3 text-sm text-primary">已选择：{file}</div>}
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
              />
            </label>
            <Card className="p-4 bg-muted/30">
              <div className="font-medium text-sm mb-2">上传提示</div>
              <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                <li>身份证正反面清晰可见，无遮挡反光</li>
                <li>学历证明需含姓名、学校、专业、毕业时间</li>
                <li>合同需清晰显示签约双方、期限</li>
                <li>简历格式不限，PDF 或图片均可</li>
              </ol>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground inline-flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-primary" /> AI 已识别 12 个字段，2 个建议人工确认
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["姓名", "张三", true],
                ["性别", "男", true],
                ["身份证号", "420106199x********", true],
                ["手机号", "138****6612", false],
                ["学历", "本科", true],
                ["毕业院校", "华中科技大学", true],
              ].map(([k, v, ok]) => (
                <div key={k as string} className="flex items-center justify-between border rounded-md px-3 py-2 text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="flex items-center gap-1.5">
                    {v}
                    {ok ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
            <div className="mt-3 font-medium">档案已生成</div>
            <div className="text-sm text-muted-foreground mt-1">已加入待同步钉钉队列</div>
          </div>
        )}

        <DialogFooter>
          {step === 1 && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
              <Button onClick={handleStart}><Sparkles className="h-4 w-4 mr-1.5" />开始识别</Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>上一步</Button>
              <Button onClick={handleConfirm}>确认并建档</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
