"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send, Loader2, Users, CheckSquare, XSquare, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomerTable } from "@/components/customers/CustomerTable";

export default function MessagingPage() {
  const [loading, setLoading] = useState(false);
  const [selectingAll, setSelectingAll] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState(
    `Good evening {Title} {Contact Person},

Thank you for warmly welcoming * Recreation Center* during our recent visit to *{School Name}*.

We are excited to connect with you and look forward to hosting your learners for a memorable experience.

For more information or bookings, please feel free to contact us anytime.

Kind regards,
*The Management*
*Tegano Recreation Center*`
  );

  // Filter state — shared with the CustomerTable AND the "Select All" query
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");

  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  // Fetch ALL matching IDs (ignoring pagination) and select them all
  const handleSelectAll = useCallback(async () => {
    setSelectingAll(true);
    try {
      const res = await api.get("/customers/ids", {
        params: {
          category: filterCategory || undefined,
          districtArea: filterDistrict || undefined,
        },
      });
      const ids: string[] = res.data;
      if (ids.length === 0) {
        toast.error("No customers match the current filters");
        return;
      }
      const selection: Record<string, boolean> = {};
      ids.forEach((id) => { selection[id] = true; });
      setRowSelection(selection);
      toast.success(`${ids.length} customer${ids.length !== 1 ? "s" : ""} selected`);
    } catch {
      toast.error("Failed to fetch matching customers");
    } finally {
      setSelectingAll(false);
    }
  }, [filterCategory, filterDistrict]);

  async function handleSend() {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      toast.error("Message is too short (minimum 10 characters)");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/messages/bulk-send", {
        customerIds: selectedIds,
        customMessage: message,
      });

      const { sent, failed } = res.data.summary;
      toast.success(`Campaign sent! ✅ ${sent} delivered, ❌ ${failed} failed`);
      setConfirmOpen(false);
      setRowSelection({});
    } catch {
      toast.error("Failed to send messages. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Messaging</h1>
        <p className="text-muted-foreground mt-1">
          Compose a message and send it to one or more customers via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Recipient Selector */}
        <div className="xl:col-span-2 flex flex-col gap-4">

          {/* Filter bar */}
          <div className="rounded-xl border bg-card p-4 flex flex-wrap gap-3 items-center">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-muted-foreground">Filter recipients:</span>

            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setRowSelection({}); }}
              className="h-9 rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-1 text-sm"
            >
              <option value="">All Categories</option>
              <option value="Infant">Infant</option>
              <option value="ECD">ECD</option>
              <option value="Primary">Primary</option>
            </select>

            <Input
              placeholder="Filter by District..."
              value={filterDistrict}
              onChange={(e) => { setFilterDistrict(e.target.value); setRowSelection({}); }}
              className="h-9 text-sm w-44"
            />

            {(filterCategory || filterDistrict) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs text-red-500 hover:text-red-700"
                onClick={() => { setFilterCategory(""); setFilterDistrict(""); setRowSelection({}); }}
              >
                <XSquare className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            )}

            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                disabled={selectingAll}
                onClick={handleSelectAll}
              >
                {selectingAll ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                ) : (
                  <CheckSquare className="h-3.5 w-3.5 mr-1" />
                )}
                Select All Matching
              </Button>

              {selectedIds.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-zinc-500"
                  onClick={() => setRowSelection({})}
                >
                  <XSquare className="h-3.5 w-3.5 mr-1" /> Clear Selection
                </Button>
              )}
            </div>
          </div>

          {/* Selection count badge */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg px-4 py-2">
              <Users className="h-4 w-4" />
              <span><strong>{selectedIds.length}</strong> recipient{selectedIds.length !== 1 ? "s" : ""} selected</span>
            </div>
          )}

          {/* Customer table */}
          <div className="rounded-xl border bg-card overflow-auto" style={{ maxHeight: "520px" }}>
            <CustomerTable
              limit={20}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              showActions={false}
              externalFilters={{ category: filterCategory, districtArea: filterDistrict }}
            />
          </div>
        </div>

        {/* Right: Message composer */}
        <div className="rounded-xl border bg-card p-6 flex flex-col gap-5 h-fit">
          <div>
            <h2 className="text-lg font-semibold mb-1">Compose Message</h2>
            <p className="text-xs text-muted-foreground">
              Personalise with: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{"{Title}"}</code>,{" "}
              <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{"{Contact Person}"}</code>,{" "}
              <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{"{School Name}"}</code>
            </p>
          </div>

          <Textarea
            className="min-h-[320px] resize-none font-mono text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your WhatsApp message here..."
          />

          <div className="text-xs text-muted-foreground text-right">
            {message.length} characters
          </div>

          <Button
            className="w-full bg-[#2D9B4E] hover:bg-[#2D9B4E]/90"
            disabled={selectedIds.length === 0 || loading}
            onClick={() => setConfirmOpen(true)}
          >
            <Send className="mr-2 h-4 w-4" />
            Send to {selectedIds.length} Recipient{selectedIds.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </div>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Message Send</DialogTitle>
            <DialogDescription>
              You are about to send a WhatsApp message to{" "}
              <strong>{selectedIds.length} customer{selectedIds.length !== 1 ? "s" : ""}</strong>.
              This may take a few minutes. Each message is sent with a short delay to respect
              WhatsApp rate limits.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 border p-3 text-xs font-mono text-zinc-700 dark:text-zinc-300 max-h-40 overflow-auto whitespace-pre-wrap">
            {message}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              className="bg-[#2D9B4E] hover:bg-[#2D9B4E]/90"
              onClick={handleSend}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Sending..." : "Confirm Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
