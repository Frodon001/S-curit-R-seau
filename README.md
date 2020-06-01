Infrastructure Réseau
=========
---------
_________

* [CCNA](https://cisco.goffinet.org/ccna/)

Globales
======
|  | Command |
| --- | --- |
| copy config  | `Router(config) #Copy run start` |
| Nom Hote | `Router(config) #hostanme R1` |
| show config router | `Router #show run` |

IPV4
======

Routing Classique
-----

> Router

| Type of route | Type | Command |
| --- | --- | --- |
| default | nextHop | ip route 0.0.0.0 0.0.0.0 192.168.X.X |
| default | interface | ip route 0.0.0.0 0.0.0.0 g0/0 |
| network | nextHop | ip route 172.16.X.X 255.255.X.X 192.168.X.X |
| network | interface | ip route 172.16.X.X 255.255.X.X g0/0 |

Routing OSPF
-----

* Poids de la route seondaire > 110

> Router A (Route principale par défault)

    ip route 0.0.0.0 0.0.0.0 g0/0
    
    router ospf 1
        default-information originate        

> Router B (Route secondaire par défault)

    ip route 0.0.0.0 0.0.0.0 f0/0 110
    
    router ospf 1
        default-information originate
        redistribute static subnets


Interface Addresse
-----

> Router

    interface f0/0
        no switchport                               => si switch l3
        ip addresse 192.168.X.X 255.255.X.X         => Addresse Statique
        ip addresse dhcp                            => config par dhcp
        ip helper-addresse <DHCP-Server Addresse>   => si serveur DHCP pour clients
        no shut

> Client

* Statique => table de routage
* DHCP => config serveur


Multit Vlan
-----

### Inteface unique

> Router

    interface f0/0
        no shut
    interface f0/0.10           => Vlan 10
        encapsulation dot1Q 10
        ip add X.X.X.X 255.X.X.X
        no shut
    interface f0/0.20           => Vlan 20
        encapsulation dot1Q 20
        ip add X.X.X.X 255.X.X.X
        no shut

### Architecture en arbre

> Router
>
> Spanning Tree (4096 * 6)

    spanning-tree vlan 10,20,100 priority 24576

> définition vlan

    vlan 10
        name IT

> inteface vlan

    vlan 10
        ip addresse 192.168.10.X 255.255.255.X
        no shut

> interface switch

    inteface f0/0
        switchport trunck encapsulation dot1q
        switchport mode trunk

> Switch
>
> inteface router

    interface f0/0
        switchport mode trunk
        
> interface client

    interface f0/24
        switchport mode access
        switchport access vlan 10


OSPF Multit Area
-----
> Router 

    ip routing
    
    router ospf 1
        default-information originate           => Router principale
        network 192.168.1.X 0.0.0.X area 1      => réseau connecté + Area au quelle elle appartient
        network 192.168.2.X 0.0.0.X area 2
        network 192.168.3.X 0.0.0.X area 3

EIGRP
-----
> Router

    router eigrp 10
        no auto-summary
        
DHCP routeur StateFull
--------

> Serveur

    si serveur -> config serveur
    routeur -> ip helper addresse <AddressServer>

> Routeur

    ip dhcp pool PoolName
        network 192.168.1.0 255.255.255.0
        default-router 192.168.1.254
        dns-server 8.8.8.8
        domain-name formation.lab
    
    ip dhcp excluded-address 192.168.1.1 192.168.1.10
    
    interface g0/0
        ip address 192.168.1.254 255.255.255.0
        no shut
    
> Client

+ IP config auto

### LACP

> 2 Routeurs avec plusieurs connexion entre eux (range interface) -> a effectué sur les 2 routeurs

    interface range g1/0/11-14
        chanel-control lacp
        channel-group 1 mode active
        switchport trunk encapsulation dot1q
        switchport mode trunk
        switchport trunk native vlan 1

### HSRP (Hot Standby Router Protocol)

> Routeur Principal (up - active)

    interface vlan 1
        standby 39 ip 10.1.10.254              ! groupe 39 -> ip virtuelle 10.1.10.254
        standby 39 priotity 150                ! priority > 100 pour active
        standby 39 preempt                     ! election si plus haut ip
        standby 39 preempt delay minimum 90
        standby 39 timers 2 7                  ! hello 2s hold 7s
        standby 39 track g1/0/24               ! diminussion prioirté si interface shutdown
      
> Routeur secours (down - passive)

      interface vlan 1
          standby 39 ip 10.1.10.254           ! groupe 39 -> ip virtuelle 10.1.10.254
          standby 39 priotity 50              ! priority < 100 pour passif
          standby 39 preempt                  ! election si plus haut ip
          standby 39 preempt delay minimum 90
          standby 39 timers 2 7               ! hello 2s hold 7s
          standby 39 track g1/0/24            ! diminussion prioirté si interface shutdown

IPV6 
======

Activer routing ``` ipv6 unicast-routing ```

Ipv6 default route ``` ipv6 route ::/0 <ipv6-addr-nextHop> ```

Ipv6 route ``` ipv6 route <addresseRéseau/64> <ipv6-addr-nextHop> ```

Interface addresse
------

> Router

    Interface g0/0
	    ipv6 enable
	    ipv6 addresse X:X:X::X/64
	    ipv6 addresse fe80::X link-local
	    no shut

> PC 

+ Addresse == addresse réseau pc
+ Default gateway  ==  link-local (fe80::X) routeur 

 Routing
 ------

 Links
 
* [IPV6](https://cisco.goffinet.org/ccna/ipv6/)
* [IPV6 routing](https://networklessons.com/ipv6/how-to-configure-ipv6-static-route)
* [OSPF](https://cisco.goffinet.org/ccna/opsf/configuration-ospfv2-et-ospfv3-cisco-ios/)
* [DHCP ipv6](https://networklessons.com/ipv6/cisco-dhcpv6-server-configuration)
* [Tunneling](https://ciscotracer.wordpress.com/2014/07/29/ipv6-tunneling-ipv6ip/)

### Statique host route nextHop -> vers hôte


> Router

    Ipv6 route 2001:db8::X/64 2001:db8::Y <Distance>
	           host address. nextHop address.


### Directly connected Floating Host route


> Router

    Ipv6 route 2001:db8::/64 2001:db8::Y <Distance>
               Host network. nextHop address.


### OSPF (multi area)

> Router

    Ipv6 unicastRouting
    
    ipv6 router ospf 1
	    router-id x.x.x.x

    Interface g0/0
	    ipv6 ospf 1 area X
	    ipv6 addressee FE80::X link-local

### StateLess (avec pool address)

> Router 

    Router(config)#ipv6 dhcp pool STATELESS
    Router(config-dhcpv6)#domain-name adminkim.com
    Router(config-dhcpv6)#dns-server <router-address>
    Router(config-dhcpv6)#exit

    Router(config)#int fa0/1
    Router(config-if)#ipv6 dhcp server STATELESS
    Router(config-if)#ipv6 addresse <routerAdresse>

> Client

+ Ipv6 -> AutoConfig

### StateLess -> SLAAC

> Router

    ipv6 dhcp pool STATELESS
        dns-server 2001:DB8:1::11
        domain-name formation.lab

    interface g0/0
        ipv6 addresse 2001:DB8:1::254/64
        ipv6 dhcp server STATELESS
	no ipv6 nd managed-config flag
      	no ipv6 nd other-config flag

> Client

+ Ipv6 -> AutoConfig


### StateFull -> DHCP


Server

+ Enable ipv6 dhcp

> Router

    ipv6 dhcp pool STATEFULL
        adresse prefix 2001:DB8:1::/64
        dns-server 2001:DB8:1::11
        domain-name formation.lab

    interface g0/0
        ipv6 addresse 2001:DB8:1::254/64
        ipv6 dhcp server STATEFULL
        ipv6 nd other-config flag

> Client

+ Ipv6 -> dhcp

### DualStack
Déployement IPV4 et IPV6 en même temps sur les appareils

### Tunneling

> Routeur Source

    <config address Interface>
    
    ipv6 unicast-routing
    ipv6 cef
    
    interface tunnel 0
        ipv6 address <addressRouteurTunnel>
        tunnel source <interfaceSortie>
        tunnel destination <addressDestinationIPV4>
        tunnel mode ipv6ip         ( mode encapsulation ipv6 dans ipv4 )
    
    
    ipv6 route <addresseRéseauDest>/64 <addIPV6TunnelRouterDest>

> Routeur Destination

    <config address Interface>
    
    ipv6 unicast-routing
    ipv6 cef
    
    interface tunnel 0
        ipv6 address <addressRouteurTunnel>
        tunnel source <interfaceSortie>
        tunnel destination <addressDestinationIPV4>
        tunnel mode ipv6ip         ( mode encapsulation ipv6 dans ipv4 )

    
    ipv6 route <addresseRéseauDest>/64 <addIPV6TunnelRouterSource>
    


    
    
    
    
        
