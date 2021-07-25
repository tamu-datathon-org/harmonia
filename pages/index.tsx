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
        </Page>
      </>
  );
}
