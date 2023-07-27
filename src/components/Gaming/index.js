import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'

import {SiYoutubegaming} from 'react-icons/si'

import {
  LoaderView,
  VideosList,
  BannerBox,
  FullView,
  MainView,
  VideosView,
  GamingBanner,
  GamingText,
  SideView,
} from './styledComponents'

import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import GamingVideos from '../GamingVideos'
import Context from '../../Context/Context'
import Failure from '../Failure'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Gaming extends Component {
  state = {
    videosList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVideosList()
  }

  getVideosList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jsToken = Cookie.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/gaming`
    const option = {
      headers: {
        Authorization: `Bearer ${jsToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, option)

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.videos.map(each => ({
        id: each.id,
        title: each.title,
        thumbnailUrl: each.thumbnail_url,
        viewCount: each.view_count,
      }))
      this.setState({
        videosList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  render() {
    const {videosList, apiStatus} = this.state

    return (
      <Context.Consumer>
        {value => {
          const {darkTheme, changeSidebarId} = value

          const onRetry = () => {
            this.getVideosDetails()
          }

          const renderFailureView = () => (
            <Failure onRetry={onRetry} darkTheme={darkTheme} />
          )

          const renderLoaderView = () => (
            <LoaderView data-testid="loader">
              <Loader
                type="ThreeDots"
                color={darkTheme ? '#f9f9f9' : '#181818'}
                height="50"
                width="50"
              />
            </LoaderView>
          )

          const renderVideosView = () => (
            <>
              <GamingBanner
                data-testid="banner"
                backgroundColor={darkTheme ? '#181818' : '#ebebeb'}
              >
                <BannerBox backgroundColor={darkTheme ? '#0f0f0f' : '#f4f4f4'}>
                  <SiYoutubegaming color="#ff0000" />
                </BannerBox>
                <GamingText color={darkTheme ? '#f9f9f9' : '#181818'}>
                  Gaming
                </GamingText>
              </GamingBanner>
              <VideosList>
                {videosList.map(each => (
                  <GamingVideos
                    data={each}
                    key={each.id}
                    darkTheme={darkTheme}
                  />
                ))}
              </VideosList>
            </>
          )

          const renderAllViews = () => {
            switch (apiStatus) {
              case apiStatusConstants.success:
                return renderVideosView()
              case apiStatusConstants.inProgress:
                return renderLoaderView()
              case apiStatusConstants.failure:
                return renderFailureView()
              default:
                return null
            }
          }

          return (
            <FullView
              onLoad={() => {
                changeSidebarId('GAMING')
              }}
            >
              <Navbar />
              <MainView>
                <SideView>
                  <Sidebar />
                </SideView>
                <VideosView
                  data-testid="gaming"
                  backgroundColor={darkTheme ? '#0f0f0f' : '#f9f9f9'}
                >
                  {renderAllViews()}
                </VideosView>
              </MainView>
            </FullView>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default Gaming
