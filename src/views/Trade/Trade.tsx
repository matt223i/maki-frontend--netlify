import React, { useState } from 'react'
import { Tabs } from 'maki-toolkit-v2'

const tabs = {
  header: ['Swap', 'Liquidity', 'Limit'],
  content: ['Hello, Content One', 'Hello, Content Two'],
}

const Trade = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)

  const selectTab = (selectedTab) => {
    setCurrentTabIndex(selectedTab)
  }

  return <Tabs headers={tabs.header} content={tabs.content} activeIndex={currentTabIndex} onTabClick={selectTab} />
}

export default Trade
