import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, ArrowRight, AlertTriangle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DEPARTMENTS = [
  "财务中心",
  "供应链",
  "品质管理部",
  "生产管理部",
  "商务部",
  "市场营销部",
  "项目管理部",
  "研发部",
  "营销中心",
  "综合管理部",
  "物业",
];

const PAYROLLS = [
  "三工光电 · 销售编制",
  "三工光电 · 市场编制",
  "三工光电 · 研发编制",
  "三工光电 · 生产编制",
  "三工光电 · 职能编制",
  "三工激光 · 销售编制",
  "三工激光 · 研发编制",
  "三工新能源 · 项目编制",
];

const REASONS = ["业务调整", "组织优化", "个人发展", "晋升", "绩效原因", "公司战略调整"];

export interface TransferContext {
  id: string;
  name: string;
  department: string;
  position: string;
  payroll?: string;
  manager?: string;
}

export function TransferDialog({
  ctx,
  open,
  onClose,
}: {
  ctx: TransferContext;
  open: boolean;
  onClose: () => void;
}) {
  const [newDept, setNewDept] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newManager, setNewManager] = useState("");
  const [newPayroll, setNewPayroll] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  );
  const [adjustSalary, setAdjustSalary] = useState<"yes" | "no">("no");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const canSubmit = newDept && newPosition && newManager && newPayroll && effectiveDate && reason;

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("请填写完整必填项");
      return;
    }
    toast.success(`${ctx.name} 调岗申请已提交，等待审批`);
    handleClose();
  };

  const handleClose = () => {
    setNewDept("");
    setNewPosition("");
    setNewManager("");
    setNewPayroll("");
    setAdjustSalary("no");
    setReason("");
    setNote("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            {ctx.name} · 发起调岗
          </DialogTitle>
          <DialogDescription>
            调岗信息将提交至直属上级与 HR 审批，审批通过后自动写入档案并同步至钉钉
          </DialogDescription>
        </DialogHeader>

        {/* 调岗对比卡 */}
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" />调岗变动预览
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="space-y-1">
              <div className="text-[10px] text-muted-foreground">当前</div>
              <div className="text-sm font-medium">{ctx.department}</div>
              <div className="text-xs text-muted-foreground">{ctx.position}</div>
              {ctx.payroll && <Badge variant="outline" className="text-[10px]">{ctx.payroll}</Badge>}
            </div>
            <ArrowRight className="h-4 w-4 text-primary" />
            <div className="space-y-1">
              <div className="text-[10px] text-muted-foreground">调动后</div>
              <div className={cn("text-sm font-medium", !newDept && "text-muted-foreground/60")}>
                {newDept || "待选择"}
              </div>
              <div className={cn("text-xs", newPosition ? "text-foreground" : "text-muted-foreground/60")}>
                {newPosition || "待填写"}
              </div>
              {newPayroll && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px]">{newPayroll}</Badge>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="目标部门" required>
            <Select value={newDept} onValueChange={setNewDept}>
              <SelectTrigger><SelectValue placeholder="请选择部门" /></SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.filter((d) => d !== ctx.department).map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="新职务" required>
            <Input value={newPosition} onChange={(e) => setNewPosition(e.target.value)} placeholder="如：销售总监" />
          </Field>

          <Field label="新汇报上级" required>
            <Input value={newManager} onChange={(e) => setNewManager(e.target.value)} placeholder="请输入上级姓名" />
          </Field>

          <Field label="新用人编制" required>
            <Select value={newPayroll} onValueChange={setNewPayroll}>
              <SelectTrigger><SelectValue placeholder="请选择编制" /></SelectTrigger>
              <SelectContent>
                {PAYROLLS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="生效日期" required>
            <Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
          </Field>

          <Field label="调岗原因" required>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue placeholder="请选择原因" /></SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="是否调薪" required className="col-span-2">
            <RadioGroup value={adjustSalary} onValueChange={(v) => setAdjustSalary(v as "yes" | "no")} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="salary-no" />
                <Label htmlFor="salary-no" className="text-sm font-normal cursor-pointer">否，沿用现薪资</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="salary-yes" />
                <Label htmlFor="salary-yes" className="text-sm font-normal cursor-pointer">是，需另行发起调薪流程</Label>
              </div>
            </RadioGroup>
          </Field>
        </div>

        {adjustSalary === "yes" && (
          <div className="rounded-md border border-warning/30 bg-warning/5 p-2.5 text-xs text-muted-foreground flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
            调薪需在调岗审批通过后，由薪资模块单独发起调薪审批，本次提交不包含薪资变更。
          </div>
        )}

        <Field label="备注 / 交接说明">
          <Textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="可填写工作交接安排、注意事项等"
          />
        </Field>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>提交调岗申请</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
