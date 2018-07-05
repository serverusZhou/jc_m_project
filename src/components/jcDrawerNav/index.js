import React, { Component } from 'react'
import { Drawer, List, NavBar, } from 'antd-mobile';

import Logo from 'components/logo';
import SearchBar from 'components/searchBar';
import styles from './index.less';
export default class DrawerNav extends Component {
	state = {
		open: false,
		showSearchBar: false,
	}
	onDock = (d) => {
		this.setState({
			[d]: !this.state[d],
		});
	}
	showSearchBar = () => {
		this.setState({
			showSearchBar: true
		})
		typeof (this.props.showSearchBar) === 'function' && this.props.showSearchBar();
	}
	navOnClick = (data) => {
		typeof (this.props.navOnClick) === 'function' && this.props.navOnClick(data);
	}

	render() {
		const { navList, } = this.props;
		const sidebar = (<List>
			{
				navList.map((item, index) => {
					return (
						<List.Item key={index} onClick={() => this.navOnClick(item)}
						>{item.name}</List.Item>
					);
				})
			}
		</List>);
		const SearchBarProps = {
			...this.props.SearchBarProps,
			/* 重新handleSearch 让其能够 更改这里的 state.showSearchBar */
			handleSearch: (searchContent) => {
				if (this.props.SearchBarProps && typeof (this.props.SearchBarProps.handleSearch) === 'function') {
					this.props.SearchBarProps.handleSearch(searchContent)
				}

				this.setState({
					showSearchBar: false
				})
			},
			style: {
				zIndex: 90,
			}
		}
		const NavBarProps = {
			style: {
				backgroundColor: '#0A0A0A',
				position: 'fixed',
				top: '0',
				left: this.state.docked ? '1.6rem' : '0',//因为fixed 的特殊性
				right: '0',
				height: '0.5rem',
				zIndex: 0,
				transition: 'left 0.3s', //这个值是根据左边的sidebar的 transition值，两边保持一致，否则一个快一个慢
			},
			onLeftClick: () => this.onDock('open')
		}

		return (
			<div style={{ paddingTop: '0.5rem' }}>
				{
					this.state.showSearchBar ? (
						<SearchBar {...SearchBarProps} />
					) : (
							<NavBar {...NavBarProps} icon={(<i className={styles["barsIcon"]}></i>)} rightContent={(<i onClick={this.showSearchBar} className={styles["searchIcon"]}></i>)}>
								<Logo />
							</NavBar>
						)
				}

				{this.state.open && <div className={styles["mask"]}></div>}
				<Drawer
					className={styles["my-drawer"]}
					style={{ minHeight: document.documentElement.clientHeight }}
					enableDragHandle
					contentStyle={{ color: '#A6A6A6', textAlign: 'center', }}
					sidebar={sidebar}
					open={this.state.open}
					onOpenChange={() => this.onDock('open')}
				>

					<div className={styles["drawerNavContent"]}>
						{this.props.children}
					</div>
				</Drawer>
			</div>
		);
	}
}
