import { Text, Page, Spinner, Button } from '@geist-ui/react';
import { UserPlus, Check, X, Smile } from '@geist-ui/react-icons'
import { useState, useEffect, SetStateAction } from 'react';
import { orgName, mailingLists, htmlContentPlaceholder } from '../components/constants';
import { Navbar } from '../components/Navbar';
import { useActiveUser, UserCurrentStatus, UserProvider } from '../components/UserProvider';
import router, { useRouter } from 'next/router';
import { join } from 'node:path';


function Home(): JSX.Element {
  const { user, status } = useActiveUser();
  const [discStatus, setDiscStatus] = useState<{isInServer : boolean, isMember : boolean, loading : boolean, } | undefined>();
  const [disableRuleButtons, setDisableRuleButtons] = useState(false);
  const [joinServer, setJoinServer] = useState(false);


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
      setDiscStatus((oldValue) => ({...oldValue, loading : true}));
      await fetch("/discord/api/agree");
      setDiscStatus((oldValue) => ({...oldValue, isMember : true, loading : false}));
    }
    catch(err) {
      setDiscStatus(undefined);
      console.error(err);
    }
    setDisableRuleButtons(false);
  }

  const changeIcon = async () => {
    setJoinServer(true);
  }

  useEffect(() => {
    if (status == UserCurrentStatus.LoggedOut) {
      (window as any).location = "/auth/login?r=/discord";
    }
  }, [status])

  useEffect(() => {
    if (user) {
      fetchStatus();
    }
    
  }, [user])


  return (
      <>
        <Navbar />
        <Page className="homepage-container">
          <Text h2 className="title">
            Join the TD Discord!
          </Text>
          {discStatus ? (
            <>
            <div className="step-1">
            <div className="circle">
              <div className="circle-content">{discStatus.isInServer ? '✔️' : '1'}</div>
            </div>
            <div style={{marginLeft: '2.5vw'}}>
              <Text h2>
                Connect your Discord
              </Text>
              {!discStatus.isInServer && (
                <Button auto type="secondary" ghost size="large" icon={<UserPlus/>} onClick={() => {router.push('/api/auth');}}>Sign In With Discord</Button>              
              )}
            </div>
          </div>

          <div className="step-2">
            <div className="circle">
              <div className="circle-content">{discStatus.isInServer && discStatus.isMember ? '✔️' : '2'}</div>
            </div>
            <div style={{marginLeft: '2.5vw'}}>
              <Text h2>
                Agree to the Server Rules
              </Text>
              {discStatus.isInServer && !discStatus.isMember && (
                <>
                <Text h4 className={`fade-in-text`}>
                  1. Follow the MLH Code of Conduct<br></br>
                  2. Follow the Discord Community Guidelines and Terms of Service.<br></br>
                  3. No spamming, foul language, or rude behavior.
                </Text>
                {!discStatus.loading ? (
                  <>
                    <Button auto type="success" ghost size="large" icon={<Check/>} className={`server-rules-button-1`} onClick={ agree } disabled={ disableRuleButtons }>Agree</Button>
                  </>
                ) : (
                  <>
                    <Button loading auto type="success" ghost size="large" icon={<Check/>} className={`server-rules-button-1`}>Agree</Button>
                  </>
                )}
                <Button auto type="error" ghost size="large" icon={<X/>} className={`server-rules-button-2`} disabled={ disableRuleButtons }>Nope</Button>
              </>
            )}
            </div>
          </div>
      
          <div className="step-3" id="step-3">
            <div className="circle">
              <div className="circle-content">{joinServer ? '✔️' : '3'}</div>
            </div>
            <div style={{marginLeft: '2.5vw'}}>
              <Text h2>
                Come on in!
              </Text>
              {discStatus.isInServer && discStatus.isMember && (
                <Button auto ghost size="large" style={{ border: '2px solid' }} icon={<Smile/>}><a onClick={ changeIcon } href="https://discord.com/channels/755441182951211028/755442777931907082" target="_blank" style={{ color: 'black' }}>Open the Discord Server</a></Button>
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