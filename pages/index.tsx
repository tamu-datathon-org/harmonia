import { Text, Page, Checkbox, Input, Textarea, Divider, Slider, Button, useToasts, Card, Link } from '@geist-ui/react';
import { useState } from 'react';
import { orgName, mailingLists, htmlContentPlaceholder } from '../components/constants';
import { Navbar } from '../components/Navbar';
import { useActiveUser } from '../components/UserProvider';

export default function Home(): JSX.Element {
  const { user, status } = useActiveUser();
  const [previewWidth, setPreviewWidth] = useState(400);
  const [, setToast] = useToasts();

  const previewWidthChangeHandler = (val) => setPreviewWidth(val);


  return (
      <>
        <Navbar />
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
          <button className="sign-in-discord-button">Sign In With Discord</button>
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
