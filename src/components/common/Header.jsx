import React, { useState, useRef } from 'react'
import classNames from 'classnames'
import get from 'lodash/get'
import { useSelector } from 'react-redux'
import useOutsideClick from '@/hooks/useOutsideClick.jsx'
import { addressShortener } from '@/utils/format'
import walletIcon from '@/assets/images/wallet.svg'
import fuseLogoWhite from '@/assets/images/FuseLogo.png'
import explorerIcon from '@/assets/images/explorer.svg'
import stakingIcon from '@/assets/images/staking-icon.svg'

const NavBar = ({ handleConnect, handleLogout }) => {
  const [isOpen, setMenuOpen] = useState(false)
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const { accountAddress, providerInfo } = useSelector(state => state.network)
  const hamburgerRef = useRef(null)
  const dropdownRef = useRef(null)

  useOutsideClick(hamburgerRef, () => {
    if (isOpen) {
      setMenuOpen(false)
    }
  })

  useOutsideClick(dropdownRef, () => {
    if (isDropdownOpen) {
      setDropdownOpen(false)
    }
  })

  return (
    <header className='header__wrapper'>
      <div className='header'>
        <div className='header__logo'>
          <img alt='logo' src={fuseLogoWhite} />
        </div>
        <button ref={hamburgerRef} className='hamburger-button__container' onClick={() => setMenuOpen(!isOpen)}>
          <span className='hamburger-button__top' />
          <span className='hamburger-button__middle' />
          <span className='hamburger-button__bottom' />
        </button>
        <div className={classNames('header__nav', { header__nav__open: isOpen })}>
          <div className='header__link__wrapper'>
            <a
              rel='noreferrer noopener'
              className={classNames('header__link', { 'header__link--dark': isOpen })}
              target='_blank'
              href='https://explorer.fuse.io/'
            >
              <img src={explorerIcon} /> Explorer
            </a>
          </div>
          {
            accountAddress
              ? (
                <div
                  className='header__wallet__wrapper'
                  ref={dropdownRef}
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                >
                  <div className='header__wallet header__wallet--logged-in'>
                    <span className='dot' />
                    <span className='text'>{addressShortener(accountAddress)}</span>
                  </div>
                  <div
                    className={classNames('header__wallet__dropdown', {
                      'header__wallet__dropdown--open': isDropdownOpen
                    })}
                  >
                    <div className='header__wallet__disconnect'>
                      Connected to {get(providerInfo, 'name')}{' '}
                      <a
                        href='#' className='header__wallet__disconnect__link' onClick={(e) => {
                          e.preventDefault()
                          handleLogout()
                        }}
                      >(disconnect)
                      </a>
                    </div>
                  </div>
                  <div className='header__wallet__disconnect_mobile'>
                    <a
                      href='#' className='header__wallet__disconnect__link' onClick={(e) => {
                        e.preventDefault()
                        handleLogout()
                      }}
                    >Disconnect
                    </a>
                  </div>
                </div>
                )
              : (
                <div className='header__wallet header__wallet--logged-out' onClick={handleConnect}>
                  <img className='icon' src={walletIcon} />
                  <span className='text'>Connect wallet</span>
                </div>
                )
          }
        </div>
      </div>
    </header>
  )
}

export default NavBar
