import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { ArrowRight, Check } from 'phosphor-react'
import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'

import { Container, Header } from '../styles'
import { AuthError, ConnectBox, ConnectItem } from './styles'

export default function ConnectCalendar() {
  const router = useRouter()
  const session = useSession()

  const hasAuthError = !!router.query?.error
  const isSignedIn = session?.status === 'authenticated'

  async function handleConnectCalendar() {
    await signIn('google')
  }

  async function handleNavigateToNextStep() {
    await router.push('/register/time-intervals')
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Connect your calendar!</Heading>

        <Text>
          Connect your calendar to verify automatically the busy hours and the
          new events as soon as they are scheduled.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {isSignedIn ? (
            <Button variant="secondary" size="sm" disabled>
              Connected
              <Check />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              Connect
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {hasAuthError ? (
          <AuthError size="sm">
            Failed to connect to Google. Verify if you have enabled the
            necessary permissions.
          </AuthError>
        ) : null}

        <Button
          type="submit"
          disabled={!isSignedIn}
          onClick={handleNavigateToNextStep}
        >
          Next step
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
