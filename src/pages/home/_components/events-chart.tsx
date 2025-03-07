import { Axis, BarSeries, Dataset, EChartsx, Grid, Once } from '@djagger/echartsx';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import { useRealtimeEvents } from '../../../components/RealtimeSummary/hooks';

export const EventsChart = ({show}: { show: boolean }) => {
  const data = useRealtimeEvents(show)
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box width={isSmall ? '100%' : '61.8%'}>
      <EChartsx init={{ height: 120, renderer: 'canvas' }}>
        <Once>
          <Grid containLabel={true} top={0} bottom={8} left={0} right={0} />
          <Axis.Category.X axisLine={{ show: false }} axisTick={{ show: false }} axisLabel={{ show: false }}
                           splitLine={{ show: false }} />
          <Axis.Value.Y axisLine={{ show: false }} axisTick={{ show: false }} axisLabel={{ show: true, align: 'right', fontSize: 12, showMinLabel: true, showMaxLabel: false, hideOverlap: true}}
                        splitLine={{ show: false }} position={'left'} interval={100} />
          <BarSeries datasetId='original' silent color="#F77C00" encode={{ x: 'latest_timestamp', y: 'cnt' }} barMaxWidth={12} />
        </Once>
        <Dataset id='original' source={data} />
      </EChartsx>
    </Box>
  );
}