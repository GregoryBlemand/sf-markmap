<?php

namespace App\Repository;

use App\Entity\Markmap;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Markmap>
 *
 * @method Markmap|null find($id, $lockMode = null, $lockVersion = null)
 * @method Markmap|null findOneBy(array $criteria, array $orderBy = null)
 * @method Markmap[]    findAll()
 * @method Markmap[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MarkmapRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Markmap::class);
    }

//    /**
//     * @return Markmap[] Returns an array of Markmap objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Markmap
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
