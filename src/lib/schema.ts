import { z } from "zod";

export const weightCalculatorSchema = z.object({
  volume: z
    .number({
      message: "Hacim sayı olmalıdır",
    })
    .positive({
      message: "Hacim 0'dan büyük olmalıdır. Örnek: 50000 mm³",
    })
    .max(100000000, {
      message: "Hacim çok büyük. Lütfen daha küçük bir değer girin (maksimum: 100,000,000 mm³)",
    })
    .optional(),
  targetWeightG: z
    .number({ message: "Ağırlık sayı olmalıdır" })
    .positive({ message: "Ağırlık 0'dan büyük olmalıdır" })
    .max(10000, { message: "Ağırlık en fazla 10.000 g olabilir" })
    .optional(),
  materialDensity: z
    .number({
      message: "Malzeme yoğunluğu sayı olmalıdır",
    })
    .positive({
      message: "Malzeme yoğunluğu 0'dan büyük olmalıdır. Örnek: 10.4 g/cm³",
    })
    .max(30, {
      message: "Malzeme yoğunluğu çok yüksek. Lütfen geçerli bir değer girin (maksimum: 30 g/cm³)",
    }),
  stoneWeight: z
    .number({
      message: "Taş ağırlığı sayı olmalıdır",
    })
    .min(0, {
      message: "Taş ağırlığı negatif olamaz. Örnek: 2.5 g",
    })
    .max(1000, {
      message: "Taş ağırlığı çok büyük. Lütfen daha küçük bir değer girin (maksimum: 1000 g)",
    })
    .default(0),
});

export type WeightCalculatorFormData = z.infer<typeof weightCalculatorSchema>;

export const sheetMetalSchema = z.object({
  areaMm2: z
    .number({ message: "Alan sayı olmalıdır" })
    .positive({ message: "Alan 0'dan büyük olmalıdır" })
    .max(100000000, { message: "Alan en fazla 100.000.000 mm² olabilir" })
    .optional(),
  targetGramG: z
    .number({ message: "Ağırlık sayı olmalıdır" })
    .positive({ message: "Ağırlık 0'dan büyük olmalıdır" })
    .max(10000, { message: "Ağırlık en fazla 10.000 g olabilir" })
    .optional(),
  thicknessMm: z
    .number({ message: "Kalınlık sayı olmalıdır" })
    .positive({ message: "Kalınlık 0'dan büyük olmalıdır. Örn: 0.40" })
    .max(100, { message: "Kalınlık en fazla 100 mm" }),
  selectedMaterialId: z.string().default("14k-gold"),
  includePendantBail: z.boolean().default(false),
  includePendantChain: z.boolean().default(false),
  includeBraceletChain: z.boolean().default(false),
});

export type SheetMetalFormData = z.input<typeof sheetMetalSchema>;
