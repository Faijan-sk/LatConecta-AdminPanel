// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'

// ** Custom Components
import UILoader from '@components/ui-loader'
import Breadcrumbs from '@components/breadcrumbs'

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap'

// ** Reactstrap Imports
import { Row, Col, Button } from 'reactstrap'

// ** Demo Components
import ProfilePoll from './ProfilePolls'
import ProfileAbout from './ProfileAbout'
import ProfilePosts from './ProfilePosts'
import ProfileHeader from './ProfileHeader'
import ProfileTwitterFeeds from './ProfileTwitterFeeds'
import ProfileLatestPhotos from './ProfileLatestPhotos'
import ProfileSuggestedPages from './ProfileSuggestedPages'
import ProfileFriendsSuggestions from './ProfileFriendsSuggestions'

// ** Styles
import '@styles/react/pages/page-profile.scss'

import {
  DollarSign,
  User,
  Lock,
  Home,
  Codepen,
  Printer,
  Database,
} from 'react-feather'
import AccountSecuroty from './AccountSecurity'

import useJwt from '@src/auth/jwt/useJwt'

const Profile = () => {
  // ** States
  const [data, setData] = useState(null)
  const [block, setBlock] = useState(false)
  const [f2Astatus, setF2Astatus] = useState(false)

  const handleBlock = () => {
    setBlock(true)
    setTimeout(() => {
      setBlock(false)
    }, 2000)
  }

  const checkF2fStatus = async () => {
    try {
      const { data } = await useJwt.check2FAStatus()
      setF2Astatus(data.is_2fa_activated)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    checkF2fStatus()
  }, [])

  return (
    <Fragment>
      <Breadcrumbs
        title="Account Setting"
        data={[{ title: 'Pages' }, { title: 'Account Setting' }]}
      />

      <div className="flex gap-3"></div>
      <div className="mt-5">
        <Card>
          <CardHeader className="border-bottom">
            <CardTitle>
              <h2>Two Step Verification</h2>
            </CardTitle>
          </CardHeader>
          <div className="d-flex justify-content-end p-1">
            {/* <Button color={'primary'} onClick={() => toggle('open')}>
              Add Currency
            </Button> */}
          </div>
          <div className="react-dataTable m-2">
            {/* <CurrencyList editRow={toggle} /> */}
            <AccountSecuroty
              f2Astatus={f2Astatus}
              checkF2fStatus={checkF2fStatus}
            />
          </div>
        </Card>
      </div>
    </Fragment>
  )
}

export default Profile
