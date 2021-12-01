import React from 'react'
import { Currency, Pair } from 'maki-sdk'
import { Button, ArrowDropDownIcon, Text, useModal } from 'maki-toolkit-v2'
import styled from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import CurrencyLogo from 'components/CurrencyLogo'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import Row, { RowBetween } from 'components/Row'
import { Input as NumericalInput } from 'components/NumericalInput'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  outline: none;
  border: none;
  border-radius: 14px;
  padding: 10px 8px;
  min-width: 144px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 3px 6px #0000001a;

  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;

  :focus,
  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.primary)};
  }
`

const StyledLabel = styled.div`
  margin-bottom: 5px;
  color: ${({ theme }) => theme.colors.text};
`

const Container = styled.div<{ hideInput: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 14px;
  padding: 10px 40px 10px 32px;
  background-color: transparent;
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )

  return (
    <Container hideInput={hideInput} id={id}>
      {!hideInput && (
        <StyledLabel>
          <RowBetween>
            <Text>{label}</Text>
            {account && (
              <Text style={{ display: 'inline', cursor: 'pointer' }} onClick={onMax}>
                {!hideBalance && !!currency && selectedCurrencyBalance
                  ? `Balance: ${selectedCurrencyBalance?.toSignificant(6)}`
                  : ' -'}
              </Text>
            )}
          </RowBetween>
        </StyledLabel>
      )}
      <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
        <CurrencySelect
          selected={!!currency}
          className="open-currency-select-button"
          onClick={() => {
            if (!disableCurrencySelect) {
              onPresentCurrencyModal()
            }
          }}
        >
          <RowBetween>
            <Row>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="18px" style={{ marginRight: '10px' }} />
              ) : null}
              {pair ? (
                <Text color="white">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text color="white">
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || 'Select Currency'}
                </Text>
              )}
            </Row>
            {!disableCurrencySelect && <ArrowDropDownIcon color="white" />}
          </RowBetween>
        </CurrencySelect>
        {!hideInput && (
          <>
            <NumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={(val) => {
                onUserInput(val)
              }}
            />
            {account && currency && showMaxButton && label !== 'To' && (
              <Button onClick={onMax} size="sm" variant="text">
                MAX
              </Button>
            )}
          </>
        )}
      </InputRow>
    </Container>
  )
}
