import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { DefterDb, Entity, Transaction } from "../db";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button, buttonVariants } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import * as z from "zod"
import { Label } from "@/components/ui/label";

const db = new DefterDb();
const formSchema = z.object({
  date: z.date(),
  amountWhole: z.string(),
  amountFractional: z.string(),
  type: z.enum(['c', 'd']),
  note: z.string(),
})
type TSchema = z.infer<typeof formSchema>

const today = new Date();

interface NewTransactionProps {
  clearDebt?: boolean
}

export default function NewTransaction({ clearDebt }: NewTransactionProps) {

  const [amountError, setAmountError] = useState('')
  const { entityId, amount } = useParams();
  const [entity, setEntity] = useState(undefined as Entity | undefined);
  useEffect(() => {
    if (
      entityId &&
      typeof entityId === "string" &&
      !Number.isNaN(parseInt(entityId))
    ) {
      db.entities.get(parseInt(entityId)).then((rec) => setEntity(rec));
    }
  }, [entityId]);
  const defaultVals: TSchema = {
    date: today,
    note: '',
    amountWhole: '0',
    amountFractional: '0',
    type: 'd'
  }
  if (clearDebt && amount && amount.includes('_')) {

    console.log(amount);

    defaultVals.note = 'Borç kapama'
    defaultVals.type = 'c'
    defaultVals.amountWhole = amount.split('_')[0]
    defaultVals.amountFractional = amount.split('_')[1]
  }

  const navigate = useNavigate();
  const form = useForm<TSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultVals,
  })


  function onSubmit(values: z.infer<typeof formSchema>) {
    setAmountError('')
    console.log(values);

    const wh = getNumSafely(values.amountWhole)
    if (wh === undefined) {
      setAmountError('Hatalı tutar')
      return
    }
    const fr = getNumSafely(values.amountFractional)
    if (fr === undefined) {
      setAmountError('Kusurat kısmında hata var')
      return
    }

    const fraction = fr > 10 ?
      fr / 100 :
      fr / 10;
    const amount = wh + fraction

    const rec: Transaction = {
      date: values.date,
      amount: amount,
      customerId: entity?.id!,
      type: values.type,
      note: values.note,
    };
    console.log(rec)

    db.transactions
      .add(rec)
      .then(() => {
        navigate(`/entities/${entityId}`)
        toast("Yeni işlem eklendi")
      });
  }

  // 

  if (!form.formState.isValid && form.formState.isDirty) {
    console.log('1', form.formState.errors);
    console.log('2', form.formState);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{entity?.name} icin yeni işlem ekle</CardTitle>
            <CardDescription>
              {entity?.note}
              <br />
              {entity?.phoneNumber}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <CardContent>

            <div>
              <Label>Tarih</Label>
              <br />
              <Controller
                control={form.control}
                name='date'
                render={({ field }) => (
                  <DatePicker
                    wrapperClassName="w-full "
                    className="p-2 w-full bg-inherit border-2 text-sm rounded "
                    placeholderText='Işlem tarihi'
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
            </div>

            <div className="w-full">

              <Label>Tutar</Label>
              <br />
              <div className="flex w-full">

                <FormField
                  control={form.control}
                  name="amountWhole"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amountFractional"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="tel"{...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {amountError.length > 0 ?
                <span>{amountError}</span>
                : <></>}
            </div>


            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Not</FormLabel>
                  <FormControl>
                    <Input placeholder="Not" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Işlem tipi</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="d" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Borçlandı
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="c" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Ödeme yaptı
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Kaydet</Button>
            <Link
              to={`/entities/${entityId}`}
              className={buttonVariants({ variant: 'outline', })}
            >
              Geri
            </Link>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function getNumSafely(s: string) {
  if (!/^\d+$/.test(s)) {
    return undefined
  }
  const parsed = parseInt(s)
  return parsed
}