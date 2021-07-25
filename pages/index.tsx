import { Text, Page, Checkbox, Input, Textarea, Divider, Slider, Button, useToasts, Card, Link } from '@geist-ui/react';
import { useState } from 'react';
import { orgName, mailingLists, htmlContentPlaceholder } from '../components/constants';
import { Navbar } from '../components/Navbar';
import { useActiveUser } from '../components/UserProvider';

export default function Home(): JSX.Element {
  const { user, status } = useActiveUser();
  const [selectedMailingLists, setSelectedMailingLists] = useState([]);
  const [emailSubject, setEmailSubject] = useState(``);
  const [emailHtml, setEmailHtml] = useState(htmlContentPlaceholder);
  const [previewWidth, setPreviewWidth] = useState(400);
  const [, setToast] = useToasts();

  const previewWidthChangeHandler = (val) => setPreviewWidth(val);

  const mailingListSelectionHandler = (values) => {
    setSelectedMailingLists(values);
  };

  const sendEmail = async () => {
    const res = await fetch('/mailing/api/messages/send', {
      body: JSON.stringify({
        to: selectedMailingLists.join(),
        from: process.env.NEXT_PUBLIC_SENDER_EMAIL,
        subject: emailSubject,
        html: emailHtml
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
    if (res.status == 200) {
      sendNotification('E-mail sent successfully!', 'success');
      setTimeout(() => {
        // reset form to prevent duplicate send
      }, 5000);
    } else {
      sendNotification('E-mail failed to send!', 'error');
    }
  };

  const sendNotification = (msg, intent) => {
    setToast({ text: msg, type: intent, delay: 3000 });
  };

  return (
    <h1>hello</h1>
  );
}
