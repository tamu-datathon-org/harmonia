import { Text, Page, Spinner } from '@geist-ui/react';
import { useState, useEffect, SetStateAction } from 'react';
import { orgName, mailingLists, htmlContentPlaceholder } from '../components/constants';
import { Navbar } from '../components/Navbar';
import { useActiveUser, UserCurrentStatus, UserProvider } from '../components/UserProvider';
import router, { useRouter } from 'next/router';


function Home(): JSX.Element {
  const { user, status } = useActiveUser();
  const [discStatus, setDiscStatus] = useState<{isInServer : boolean, isMember : boolean} | undefined>();
  const [disableRuleButtons, setDisableRuleButtons] = useState(false);


  const router = useRouter();

  const fetchStatus = async () => {
    try {
      const data = await fetch("/discord/api/status").then((res) => res.json());
      setDiscStatus(data);
    }
    catch(err) {
      setDiscStatus(undefined);
      console.error(err);
    }
  }

  const agree = async () => {
    setDisableRuleButtons(true);
    try {
      await fetch("/discord/api/agree");
      setDiscStatus((oldValue) => ({...oldValue, isMember : true}));
    }
    catch(err) {
      setDiscStatus(undefined);
      console.error(err);
    }
    setDisableRuleButtons(false);
  }

  useEffect(() => {
    if (status == UserCurrentStatus.LoggedOut) {
      (window as any).location = "/auth/login?r=/discord";
    }
  }, [status])

  useEffect(() => {
    if(user) {
      fetchStatus();
    }
    
  }, [user])


  return (
      <>
        <Navbar />
        <Page className="homepage-container">
          <Text h2 style={{ marginBottom: '5px' }}>
            Harmonia
          </Text>
          <Text className="sub-heading">{orgName} Discord Authentication</Text>
          {discStatus ? (
            <>
            <div className="step-1">
            <div className="circle">{discStatus.isInServer ? '✔️' : '1'}</div>
            <div>
              <Text h2>
                Connect your Discord Account
              </Text>
              {!discStatus.isInServer && (
                <button className="sign-in-discord-button" type="button" onClick={() => {router.push('/api/auth');}}>Sign In With Discord</button>              
              )}
            </div>
          </div>

          <div className="step-2">
            <div className="circle" id="circle-2">{discStatus.isInServer && discStatus.isMember ? '✔️' : '2'}</div>
            <div>
              <Text h2>
                Agree to the Server Rules
              </Text>
              {discStatus.isInServer && !discStatus.isMember && (
                <>
                <Text h4>
                  1. Don't be an asshole<br></br>
                  2. No Racism<br></br>
                  3. You also follow the MLH Rules
                </Text>
                <button className={`server-rules-button-1`} id='accept' onClick={agree} disabled={disableRuleButtons}>I Agree</button><button id='deny' className="server-rules-button-2" disabled={disableRuleButtons}>Nope</button>
              </>              
            )}
            </div>
          </div>
      
          <div className="step-3" id="step-3">
            <div className="circle">3</div>
            <div>
              <Text h2>
                Come on in!
              </Text>
              {discStatus.isInServer && discStatus.isMember && (
                <button className="sign-in-discord-button"><a href="https://discord.com/channels/755441182951211028/755442777931907082">Open the Discord Server</a></button>
              )}
              </div>
          </div></>
          ) : (
            <Spinner size="large"></Spinner>
          )}
          
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