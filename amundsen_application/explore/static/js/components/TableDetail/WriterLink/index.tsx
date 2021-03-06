import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import AvatarLabel from 'components/common/AvatarLabel';
import { logClick } from 'ducks/utilMethods';
import { TableWriter } from 'interfaces';

export interface WriterLinkProps {
  tableWriter: TableWriter;
}

const WriterLink: React.SFC<WriterLinkProps> = ({ tableWriter }) => {
  if (tableWriter === null || tableWriter.application_url === null) {
    return null;
  }
  const image = (tableWriter.name === 'Airflow') ?  '/explore/static/images/airflow.jpeg' : '';

  return (
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement='top'
      delayHide={ 200 }
      overlay={
        <Popover id="popover-trigger-hover-focus">
          { tableWriter.id }
        </Popover>
      }
    >
      <a
        id="explore-writer"
        className="header-link"
        href={tableWriter.application_url}
        onClick={ logClick }
        target='_blank'
      >
        <AvatarLabel label={tableWriter.name} src={image}/>
      </a>
    </OverlayTrigger>
  );
};

export default WriterLink;
