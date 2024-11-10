import vine from "@vinejs/vine"

export const registerSchema = vine.object({
    name: vine.string().minLength(2).maxLength(190),
    email: vine.string().email(),
    password: vine
      .string()
      .minLength(8)
      .maxLength(32)
      .confirmed(),
  })

  export const LoginSchema = vine.object({
    email:vine.string().email(),
    password: vine.string(),
  })