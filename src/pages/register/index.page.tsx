import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container, Form, FormError, Header } from './styles'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username should have at least 3 characters' })
    .regex(/^([a-z\\\\-]+)$/i, {
      message: 'Username should have only letters and hyphen',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'Name should have at least 3 characters' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query?.username) {
      setValue('username', String(router.query?.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister({ name, username }: RegisterFormData) {
    try {
      await api.post('/users', {
        name,
        username,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.message) {
        alert(error.response.data.message)
      }
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Welcome to my Appointment Scheduling!</Heading>

        <Text>
          We need some information to create your profile! You can change your
          information later.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Username</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="your-username"
            {...register('username')}
          />

          {errors.username ? (
            <FormError size="sm">{errors.username.message}</FormError>
          ) : null}
        </label>

        <label>
          <Text size="sm">Full name</Text>
          <TextInput placeholder="Name" {...register('name')} />

          {errors.name ? (
            <FormError size="sm">{errors.name.message}</FormError>
          ) : null}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Next step
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
