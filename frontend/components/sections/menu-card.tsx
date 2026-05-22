import Image from "next/image";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { MenuItem } from "@/types/domain";

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <Card className="flex gap-4 p-4">
      <div className="relative h-24 w-24 overflow-hidden rounded-2xl">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-stone-900">{item.name}</h3>
            <p className="mt-1 text-sm text-stone-500">{item.description}</p>
          </div>
          {item.promo ? <Badge>{item.promo}</Badge> : null}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-red-900">
            {formatRupiah(item.price)}
          </span>
          <Button size="sm" className="rounded-2xl px-3">
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
