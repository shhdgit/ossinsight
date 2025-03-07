import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import useMediaQuery from '@mui/material/useMediaQuery';
import { GitMergeIcon, IssueOpenedIcon, PersonIcon, StarIcon } from '@primer/octicons-react';
import React, { ForwardedRef, forwardRef, PropsWithChildren, useCallback, useContext, useState } from 'react';
import Analyze from '../../../analyze-charts/Analyze';
import { CompaniesChart } from '../../../analyze-charts/companies';
import { AnalyzeChartContext, useAnalyzeContext } from '../../../analyze-charts/context';
import List from '../../../analyze-charts/list/List';
import { WorldMapChart } from '../../../analyze-charts/worldmap';
import { alpha2ToTitle } from '../../../lib/areacode';
import Section from '../Section';
import styles from '../styles.module.css';
import { H2, H3, H4, P2 } from '../typography';

export const PeopleSection = forwardRef(function ({}, ref: ForwardedRef<HTMLElement>) {
  const theme = useTheme()
  const { comparingRepoId: vs, comparingRepoName } = useAnalyzeContext()

  // hooks for sections
  const [mapType, setMapType] = useState('stars-map')
  const handleChangeMapType = useCallback((event:  React.SyntheticEvent, value: string) => {
    setMapType(value)
  }, [])

  const [companyType, setCompanyType] = useState('analyze-stars-company')
  const handleChangeCompanyType = useCallback((event:  React.SyntheticEvent, value: string) => {
    setCompanyType(value)
  }, [])


  return (
    <Section id='people' ref={ref}>
      <H2>People</H2>
      <Analyze query={mapType}>
        <H3 sx={{ mt: 6 }}>Geographical Distribution</H3>
        <P2>Stargazers,Issue creators and Pull Request creators’ geographical distribution around the world (analyzed with the public github infomation).</P2>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={mapType} onChange={handleChangeMapType} variant='scrollable' scrollButtons='auto' allowScrollButtonsMobile>
            <IconTab id='geo-distribution-stargazers' value='stars-map' icon={<StarIcon size={24} />}><span style={{ display: 'none' }}>Geographical Distribution of </span>Stargazers</IconTab>
            <IconTab id='geo-distribution-issue-creators' value='issue-creators-map' icon={<IssueCreatorIcon size={24} />}><span style={{ display: 'none' }}>Geographical Distribution of </span>Issue Creators</IconTab>
            <IconTab id='geo-distribution-pr-creators' value='pull-request-creators-map' icon={<PrCreatorIcon size={24} />}><span style={{ display: 'none' }}>Geographical Distribution of </span>Pull Requests Creators</IconTab>
          </Tabs>
        </Box>
        <Grid container alignItems='center'>
          <Grid item xs={12} md={vs ? 8 : 9}>
            <WorldMapChart aspectRatio={3 / 2} />
          </Grid>
          <Grid item xs={12} md={vs ? 4 : 3}>
            <List title='Geo-Locations' n={10} /* valueIndex='count' */ nameIndex='country_or_area' percentIndex='percentage' transformName={alpha2ToTitle} />
          </Grid>
        </Grid>
      </Analyze>
      <Analyze query={companyType} params={{limit: comparingRepoName ? 25 : 50}}>
        <H3 sx={{ mt: 6 }}>Companies</H3>
        <P2>Company information about Stargazers, Issue creators, and Pull Request creators(analyzed with the public github infomation).</P2>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={companyType} onChange={handleChangeCompanyType} variant='scrollable' scrollButtons='auto' allowScrollButtonsMobile>
            <IconTab id='companies-stargazers' value='analyze-stars-company' icon={<StarIcon />}>Stargazers<span style={{ display: 'none' }}>' Companies</span></IconTab>
            <IconTab id='companies-issue-creators' value='analyze-issue-creators-company' icon={<IssueCreatorIcon size={24} />}>Issue Creators<span style={{ display: 'none' }}>' Companies</span></IconTab>
            <IconTab id='companies-pr-creators' value='analyze-pull-request-creators-company' icon={<PrCreatorIcon size={24} />}>Pull Requests Creators<span style={{ display: 'none' }}>' Companies</span></IconTab>
          </Tabs>
        </Box>
        <Grid container alignItems='center'>
          <Grid item xs={12} md={vs ? 8 : 9}>
            <CompaniesChart spec={{valueIndex: companyValueIndices[companyType]}} aspectRatio={3 / 2} />
          </Grid>
          <Grid item xs={12} md={vs ? 4 : 3}>
            <List title='Companies' n={10} /* valueIndex={companyValueIndices[companyType]} */ nameIndex='company_name' percentIndex='proportion' />
          </Grid>
        </Grid>
      </Analyze>
    </Section>
  )
})

const IconTab = ({children, id, icon, ...props}: PropsWithChildren<{ id: string, value: string, icon?: React.ReactNode }>) => {
  const { headingRef } = useContext(AnalyzeChartContext)
  const handleClick = useCallback((event: React.MouseEvent<HTMLHeadingElement>) => {
    headingRef(event.currentTarget)
  }, [])
  return (
    <Tab
      {...props}
      sx={{ textTransform: 'unset' }}
      label={(
        <H4 id={id} analyzeTitle onClick={handleClick}>
          {icon}
          &nbsp;
          {children}
        </H4>
      )}
    />
  )
}

const IssueCreatorIcon = ({ size }: { size: number }) => (
  <Box display='inline-block' position='relative'>
    <PersonIcon size={size} />
    <IssueOpenedIcon size={size / 3} className={styles.subIcon} />
  </Box>
)

const PrCreatorIcon = ({ size }: { size: number }) => (
  <Box display='inline-block' position='relative'>
    <PersonIcon size={size} />
    <GitMergeIcon size={size / 3} className={styles.subIcon} />
  </Box>
)

const companyValueIndices = {
  'analyze-stars-company': 'stargazers',
  'analyze-issue-creators-company': 'issue_creators',
  'analyze-pull-request-creators-company': 'code_contributors'
}