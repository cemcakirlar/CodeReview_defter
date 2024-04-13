import { Link, useParams, useNavigate } from "react-router-dom";
import { DefterDb, Entity, Transaction } from "../db";
import { useEffect, useState } from "react";
import { BsTelephoneOutbound, BsWhatsapp, MdOutlineTextsms, } from "../icons";
import { TrashIcon } from "@radix-ui/react-icons";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label";

const db = new DefterDb();
export default function TransactionDetail() {
  const [open, setOpen] = useState(false);


  const navigate = useNavigate();
  const { entityId, transactionId } = useParams();
  const [transaction, setTransaction] = useState(
    undefined as Transaction | undefined
  );

  useEffect(() => {
    if (
      transactionId &&
      typeof transactionId === "string" &&
      !Number.isNaN(parseInt(transactionId))
    ) {
      db.transactions
        .where("id")
        .equals(parseInt(transactionId) ?? -1)
        .toArray()
        .then((ts) => {
          if (ts.length > 0) {
            setTransaction(ts[0]);
          } else {
            navigate(`/entities/${entityId}`);
          }
        });
    } else {
      navigate(`/entities/${entityId}`);
    }
  }, []);
  const [entity, setEntity] = useState(undefined as Entity | undefined);
  useEffect(() => {
    if (
      entityId &&
      typeof entityId === "string" &&
      !Number.isNaN(parseInt(entityId))
    ) {
      db.entities.get(parseInt(entityId)).then((rec) => {
        if (rec) {
          setEntity(rec);
        } else {
          navigate(`/entities/`);
        }
      });
    } else {
      navigate(`/entities/`);
    }
  }, [entityId]);

  const normalizedPhoneNumber = normalizePhoneNumber(entity?.phoneNumber ?? "");
  const phoneNumberIsInvalid = normalizedPhoneNumber == "invalid";

  const msg = phoneNumberIsInvalid
    ? ""
    : transaction?.type === "d"
      ? `${getLocaleDate(transaction.date)} tarihinde ${transaction.amount
      } tl borclandiniz`
      : transaction?.type === "c"
        ? `${getLocaleDate(transaction.date)} tarihinde ${transaction.amount
        } tl odeme yaptiniz`
        : "";

  function handleRemove() {
    if (
      transactionId &&
      typeof transactionId === "string" &&
      !Number.isNaN(parseInt(transactionId))
    ) {
      db.transactions
        .delete(parseInt(transactionId))
        .then(() => navigate(`/entities/${entityId}`));
    }
  }
  if (!transaction) {
    return <>islem bulunamadi</>
  }

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emin misiniz?</DialogTitle>
            <DialogDescription>İşlem silinecektir.Bu işlem geri alınamaz.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex justify-between items-center flex-1">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Vazgeç
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" onClick={handleRemove} variant="destructive">
                  İşlemi Sil
                </Button>
              </DialogClose>

            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{entity?.name}</CardTitle>
              <CardDescription>
                {entity?.note}
                <br />
                {entity?.phoneNumber}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className={buttonVariants()}>
                İşlemler
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {phoneNumberIsInvalid ? (
                  <DropdownMenuItem disabled>
                    Hatalı telefon numarası
                  </DropdownMenuItem>
                )
                  : (
                    <>
                      <DropdownMenuItem>
                        <a
                          className="flex items-center gap-1"
                          href={`tel:${normalizedPhoneNumber}`}>
                          <BsTelephoneOutbound />
                          Arama yap
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a
                          target="_blank"
                          className="flex items-center gap-1"
                          href={`sms:${normalizedPhoneNumber}&body=${msg}`}
                        >
                          <MdOutlineTextsms /> Kısa mesaj
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a
                          target="_blank"
                          className="flex items-center gap-1"
                          href={`https://wa.me/${normalizedPhoneNumber}?text=${msg}`}
                        >
                          <BsWhatsapp /> Whatsapp
                        </a>
                      </DropdownMenuItem>
                    </>
                  )
                }
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setOpen(true) }}>
                  <TrashIcon />
                  İşlemi Sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Status
            balance={transaction.amount ?? 0}
            type={transaction.type ?? 'c'}
            date={transaction.date ?? new Date()}
          />
          {transaction.note.length > 0 ?
            <Label>Not: {transaction.note}</Label>
            : <></>
          }
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link
            to={`/entities/${entityId}/new`}
            className={buttonVariants()}
          >
            Yeni işlem ekle
          </Link>
          <Link
            to={`/entities/${entityId}`}
            className={buttonVariants({ variant: 'outline' })}
          >
            Geri
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

function normalizePhoneNumber(phoneNumber: string) {
  phoneNumber = phoneNumber.replaceAll(/\s/g, "");
  if (phoneNumber.startsWith("+9")) {
    phoneNumber = phoneNumber.replace(/\+/, "");
  } else if (phoneNumber.startsWith("0090")) {
    phoneNumber = phoneNumber.replace(/0090/, "90");
  } else if (phoneNumber.startsWith("5")) {
    phoneNumber = "90" + phoneNumber;
  } else {
    phoneNumber = "invalid";
  }

  if (phoneNumber.length < 10) {
    phoneNumber = "invalid";
  }

  return phoneNumber;
}

function getLocaleDate(ms: Date | undefined) {
  return ms?.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // dateStyle:'long'
  });
}


interface StatusProps {
  balance: number,
  type: 'c' | 'd',
  date: Date
}

function Status({ balance, type, date }: StatusProps) {
  const positive = `${getLocaleDate(date)} tarihinde ${balance} tl ödeme yaptı`
  const negative = `${getLocaleDate(date)} tarihinde ${balance} tl borçlandı`

  return (
    <div className="flex justify-center items-center">
      {type == 'c' ?
        <span className="border-2 rounded-lg p-2">{positive}</span>
        : <span className="text-destructive-foreground bg-destructive p-2 rounded">{negative}</span>
      }
    </div>
  )
}