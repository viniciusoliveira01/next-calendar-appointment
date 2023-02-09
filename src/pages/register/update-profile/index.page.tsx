import { api } from '@/lib/axios'
import { buildNextAUthOptions } from '@/pages/api/auth/[...nextauth].api'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'

const updateProfileFormSchema = z.object({
  bio: z.string(),
})

type updateProfileFormData = z.infer<typeof updateProfileFormSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<updateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
  })

  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile({ bio }: updateProfileFormData) {
    await api.put('/users/profile', {
      bio,
    })

    if (session?.data?.user?.username) {
      return await router.push(`/schedule/${session?.data?.user?.username}`)
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

        <MultiStep size={4} currentStep={4} />
      </Header>

      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size="sm">Profile picture</Text>
          <Avatar
            src={session?.data?.user?.avatar_url}
            alt={`${session?.data?.user?.name} avatar`}
          />
        </label>

        <label>
          <Text size="sm">About you</Text>
          <TextArea {...register('bio')} />

          <FormAnnotation size="sm">
            Write a little about you so we can show in your profile!
          </FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Submit
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAUthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}
