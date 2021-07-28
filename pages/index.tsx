import { Text, Page, Checkbox, Input, Textarea, Divider, Slider, Button, useToasts, Card, Link } from '@geist-ui/react';
import { useState, useEffect } from 'react';
import { orgName, mailingLists, htmlContentPlaceholder } from '../components/constants';
import { Navbar } from '../components/Navbar';
import { useActiveUser, UserCurrentStatus, UserProvider } from '../components/UserProvider';
import router, { useRouter } from 'next/router';


function Home(): JSX.Element {
  const { user, status } = useActiveUser();
  const [previewWidth, setPreviewWidth] = useState(400);
  const [, setToast] = useToasts();

  const previewWidthChangeHandler = (val) => setPreviewWidth(val);

  const router = useRouter();

  useEffect(() => {
    if (status == UserCurrentStatus.LoggedOut) {
      (window as any).location = "/auth/login?r=/discord";
    }
  }, [status])


  return (
      <>
        <Navbar />
        <p>Logged in as: {user?.email}</p>
        <Page className="homepage-container">
          <Text h2 style={{ marginBottom: '5px' }}>
            Harmonia
          </Text>
          <Text className="sub-heading">{orgName} Discord Authentication</Text>

          <div className="circle">1</div>
          <Text h2>
            Connect your Discord Account
          </Text>
          <br></br>
          <button className="sign-in-discord-button" type="button" onClick={() => router.push('/api/auth')}>Sign In With Discord</button>
          <br></br>

          <div className="circle">2</div>
          <Text h2>
            Agree to the Server Rules
          </Text>
          <br></br>
          <button className="server-rules-button-1">I Agree</button><button className="server-rules-button-2">Nope</button>
          <br></br>

          <div className="circle">3</div>
          <Text h2>
            Come on in!
          </Text>
          <br></br>
          <button className="sign-in-discord-button">Open the Discord Server</button>
        </Page>
      </>
  );
}

export default function HomePage() {
  return (
    <UserProvider>
      <Home/>
    </UserProvider>
  )
} 