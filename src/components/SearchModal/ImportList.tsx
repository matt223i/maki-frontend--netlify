import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { TokenList } from '@uniswap/token-lists'
import { useDispatch } from 'react-redux'
import { Button, Text, Link } from 'maki-toolkit-v2'
import Card from 'components/Card'
import { AutoColumn } from 'components/Layout/Column'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { ListLogo } from 'components/Logo'
import { AppDispatch } from 'state'
import useFetchListCallback from 'hooks/useFetchListCallback'
import { removeList, enableList } from 'state/lists/actions'
import { useAllLists } from 'state/lists/hooks'
import { useTranslation } from 'contexts/Localization'

interface ImportProps {
  listURL: string
  list: TokenList
  onImport: () => void
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const TextDot = styled.div`
  height: 3px;
  width: 3px;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 50%;
`

function ImportList({ listURL, list, onImport }: ImportProps) {
  const dispatch = useDispatch<AppDispatch>()

  const { t } = useTranslation()

  // user must accept
  const [confirmed] = useState(false)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId)
  const [addError, setAddError] = useState<string | null>(null)

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listURL)
      .then(() => {
        dispatch(enableList(listURL))
        onImport()
      })
      .catch((error) => {
        setAddError(error.message)
        dispatch(removeList(listURL))
      })
  }, [adding, dispatch, fetchList, listURL, onImport])

  return (
    <Wrapper>
      <AutoColumn gap="md">
        <AutoColumn gap="md">
          <Card padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {list.logoURI && <ListLogo logoURI={list.logoURI} size="40px" />}
                <AutoColumn gap="sm" style={{ marginLeft: '20px' }}>
                  <RowFixed>
                    <Text bold mr="6px">
                      {list.name}
                    </Text>
                    <TextDot />
                    <Text small color="textSubtle" ml="6px">
                      {list.tokens.length} tokens
                    </Text>
                  </RowFixed>
                  <Link
                    small
                    external
                    ellipsis
                    maxWidth="90%"
                    href={`https://tokenlists.org/token-list?url=${listURL}`}
                  >
                    {listURL}
                  </Link>
                </AutoColumn>
              </RowFixed>
            </RowBetween>
          </Card>

          <Button disabled={!confirmed} onClick={handleAddList}>
            {t('Import')}
          </Button>
          {addError ? (
            <Text color="failure" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {addError}
            </Text>
          ) : null}
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}

export default ImportList
