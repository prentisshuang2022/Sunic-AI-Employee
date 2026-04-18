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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { LogOut, AlertTriangle, ShieldAlert, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LEAVE_TYPES = ["主动离职", "协商解除", "合同到期不续签", "辞退", "退休", "其他"];

const LEAVE_REASONS = [
  "个人发展",
  "家庭原因",
  "薪酬福利",
  "工作内容不匹配",
  "通勤距离",
  "健康原因",
  "其他",
];

const HANDOVER_PRESETS = [
  "在手客户 / 项目交接清单",
  "工作邮箱 / 钉钉群组转交",
  "项目文档 / 代码仓库权限",
  "财务报销结清",
  "公司账号 / 系统权限回收",
];

const ASSET_PRESETS = [
  "笔记本电脑",
  "工卡 / 门禁卡",
  "钥匙",
  "工服 / 劳保",
  "公司手机 / SIM 卡",
  "其他办公用品",
];

export interface LeaveContext {
  id: string;
  name: string;
  department: string;
  position: string;
  hireDate?: string;
}

export function LeaveDialog({
  ctx,
  open,
  onClose,
}: {
  ctx: LeaveContext;
  open: boolean;
  onClose: () => void;
}) {
  const [type, setType] = useState("");
  const [applyDate, setApplyDate] = useState(new Date().toISOString().slice(0, 10));
  const [lastDay, setLastDay] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [reason, setReason] = useState("");
  const [handoverTo, setHandoverTo] = useState("");
  const [handoverItems, setHandoverItems] = useState<string[]>([]);
  const [assetItems, setAssetItems] = useState<string[]>([]);
  const [hasNDA, setHasNDA] = useState(false);
  const [hasNonCompete, setHasNonCompete] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [note, setNote] = useState("");

  const toggle = (list: string[], setList: (v: string[]) => void, item: string) =>
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

  const canSubmit = type && applyDate && lastDay && reason && handoverTo;

  const daysLeft = Math.ceil(
    (new Date(lastDay).getTime() - new Date(applyDate).getTime()) / 86400000
  );

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("请填写完整必填项");
      return;
    }
    toast.success(`${ctx.name} 离职申请已提交，等待 HR 与上级审批`);
    handleClose();
  };

  const handleClose = () => {
    setType("");
    setReason("");
    setHandoverTo("");
    setHandoverItems([]);
    setAssetItems([]);
    setHasNDA(false);
    setHasNonCompete(false);
    setInterviewDate("");
    setInterviewer("");
    setNote("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-destructive" />
            {ctx.name} · 发起离职
          </DialogTitle>
          <DialogDescription>
            {ctx.department} · {ctx.position} · 提交后启动离职审批与交接流程
          </DialogDescription>
        </DialogHeader>

        {/* 警示横幅 */}
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div className="text-xs">
            <div className="font-medium text-destructive">离职是不可逆操作</div>
            <div className="text-muted-foreground mt-0.5">
              提交后将冻结员工系统权限申请，请确认信息无误。最后工作日前完成交接、面谈与资产归还。
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="离职类型" required>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
              <SelectContent>
                {LEAVE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="离职原因" required>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue placeholder="请选择原因" /></SelectTrigger>
              <SelectContent>
                {LEAVE_REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="申请离职日期" required>
            <Input type="date" value={applyDate} onChange={(e) => setApplyDate(e.target.value)} />
          </Field>

          <Field label="最后工作日" required>
            <div className="space-y-1">
              <Input type="date" value={lastDay} onChange={(e) => setLastDay(e.target.value)} />
              {daysLeft > 0 && (
                <div className={cn(
                  "text-[11px] tabular-nums",
                  daysLeft < 30 ? "text-warning" : "text-muted-foreground"
                )}>
                  距最后工作日还有 {daysLeft} 天{daysLeft < 30 && " · 不足 30 天提前期"}
                </div>
              )}
            </div>
          </Field>

          <Field label="工作交接人" required className="col-span-2">
            <Input
              value={handoverTo}
              onChange={(e) => setHandoverTo(e.target.value)}
              placeholder="请输入接手人姓名"
            />
          </Field>
        </div>

        {/* 交接清单 */}
        <Field label="交接事项">
          <div className="grid grid-cols-2 gap-2 rounded-md border p-3 bg-muted/20">
            {HANDOVER_PRESETS.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={handoverItems.includes(item)}
                  onCheckedChange={() => toggle(handoverItems, setHandoverItems, item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </Field>

        {/* 资产归还 */}
        <Field label="资产归还清单">
          <div className="grid grid-cols-2 gap-2 rounded-md border p-3 bg-muted/20">
            {ASSET_PRESETS.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={assetItems.includes(item)}
                  onCheckedChange={() => toggle(assetItems, setAssetItems, item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
          {assetItems.length > 0 && (
            <div className="text-[11px] text-muted-foreground mt-1.5">
              已勾选 <Badge variant="secondary" className="text-[10px] mx-0.5">{assetItems.length}</Badge> 项资产，行政将于最后工作日核对
            </div>
          )}
        </Field>

        {/* 协议提醒 */}
        <Field label="合规协议提醒">
          <div className="space-y-2 rounded-md border border-warning/30 bg-warning/5 p-3">
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={hasNDA}
                onCheckedChange={(v) => setHasNDA(!!v)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldAlert className="h-3.5 w-3.5 text-warning" />
                  已与员工确认《保密协议》仍持续生效
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  员工离职后仍负有保密义务，需在离职面谈时书面确认
                </div>
              </div>
            </label>
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={hasNonCompete}
                onCheckedChange={(v) => setHasNonCompete(!!v)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldAlert className="h-3.5 w-3.5 text-warning" />
                  已与员工确认《竞业限制协议》启动 / 解除条款
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  如启动竞业限制，HR 需另行发起补偿金支付流程
                </div>
              </div>
            </label>
          </div>
        </Field>

        {/* 离职面谈 */}
        <Field label="离职面谈安排">
          <div className="grid grid-cols-2 gap-3 rounded-md border p-3 bg-muted/20">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />面谈时间
              </Label>
              <Input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">面谈负责人</Label>
              <Input
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                placeholder="如：李 HR"
              />
            </div>
          </div>
        </Field>

        <Field label="备注">
          <Textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="补充说明，如薪资结算特殊情况等"
          />
        </Field>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>取消</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={!canSubmit}>
            <LogOut className="h-4 w-4 mr-1.5" />提交离职申请
          </Button>
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
