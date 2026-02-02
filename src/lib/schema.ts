import { z } from "zod";

export const weightCalculatorSchema = z.object({
  volume: z
    .number()
    .positive("Hacim 0'dan büyük olmalıdır")
    .optional(),
  materialDensity: z
    .number()
    .positive("Malzeme yoğunluğu 0'dan büyük olmalıdır"),
  stoneWeight: z
    .number()
    .min(0, "Taş ağırlığı 0'dan küçük olamaz")
    .default(0),
});

export type WeightCalculatorFormData = z.infer<typeof weightCalculatorSchema>;
