import { Text, Page, Spinner, Button, Loading } from '@geist-ui/react';
import { UserPlus, Check, X, Smile } from '@geist-ui/react-icons'
import { useState, useEffect, SetStateAction } from 'react';
import { orgName, mailingLists, htmlContentPlaceholder } from '../components/constants';
import { Navbar } from '../components/Navbar';
import { useActiveUser, UserCurrentStatus, UserProvider } from '../components/UserProvider';
import router, { useRouter } from 'next/router';
import { join } from 'node:path';
import Image from 'next/image';
//import tdlogo from '../public/main.png';


function Home(): JSX.Element {
  const { user, status } = useActiveUser();
  const [discStatus, setDiscStatus] = useState<{isInServer : boolean, isMember : boolean, loading : boolean, } | undefined>();
  const [disableRuleButtons, setDisableRuleButtons] = useState(false);
  const [joinServer, setJoinServer] = useState(false);


  const router = useRouter();

  const fetchStatus = async () => {
    try {
      console.log("start");
      const data = await fetch("/discord/api/status").then((res) => res.json());
      console.log("TAKES SO LONG TO GET HERE");
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
          <Text p className="title-1">
            Join the
            <Text h4 className="title-2">
              TAMU Datathon Discord
            </Text>
          </Text>
          <div className="container">
          {discStatus ? (
            <>
            <div className="step-1">
            <div>
              <div className="status">{discStatus.isInServer ? '✔️' : ''}1</div>
            </div>
            <div style={{marginLeft: '1.5vw'}}>
              <Text h4>
                Connect your Discord
              </Text>
              {!discStatus.isInServer && (
                <a role="button" className="btn sign-in-btn" style={{color: "white"}} onClick={() => {router.push('/api/auth');}}>Sign In With Discord</a>           
              )}
            </div>
          </div>

          <div className="step-2">
            <div>
              <div className="status">{discStatus.isInServer && discStatus.isMember ? '✔️' : ''}2</div>
            </div>
            <div style={{marginLeft: '1.5vw'}}>
              <Text h4>
                Agree to the Server Rules:
              </Text>
              {discStatus.isInServer && !discStatus.isMember && (
                <>
                <Text p className={`fade-in-text`}>
                  1. Follow the <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH Code of Conduct</a><br></br>
                  2. Follow the <a href="https://discord.com/guidelines">Discord Community Guidelines</a> and <a href="https://discord.com/terms">Terms of Service.</a><br></br>
                  3. No spamming, foul language, or rude behavior.
                </Text>
                {!discStatus.loading ? (
                  <>
                    <a role="button" className="btn agree-btn" style={{color: "white"}} onClick={ agree }>Agree</a>
                  </>
                ) : (
                  <>
                    <a role="button" className="btn agree-btn" style={{color: "white"}}>Agree</a>
                  </>
                )}
                <a role="button" className="btn nope-btn" style={{color: "white"}}>Nope</a>
              </>
            )}
            </div>
          </div>
      
          <div className="step-3" id="step-3">
            <div>
              <div className="status">{joinServer ? '✔️' : ''}3</div>
            </div>
            <div style={{marginLeft: '1.5vw'}}>
              <Text h4>
                Come on in!
              </Text>
              {discStatus.isInServer && discStatus.isMember && (   
                <a href="/apply" role="button" className="btn apply-btn">Apply</a>
              )}
              </div>
          </div></>
          ) : (
            //<Spinner size="large">
              <Loading>Fetching your Discord Status</Loading>
            //</Spinner>
          )}
          </div>
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